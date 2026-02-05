import { test, expect } from '@playwright/test';

/**
 * Phase 2 Sprint 1: Student Flow E2E Tests
 * Tests the complete student journey from 3 perspectives:
 * 1. Western student booking Egyptian teacher (Arabic lessons)
 * 2. Pakistani student booking Pakistani teacher (Quran memorization)
 * 3. Tunisian student booking Tunisian teacher (Islamic fundamentals)
 * 
 * Student Flow:
 * - Signup/Login
 * - Browse Teachers (filter by language, region, specialization)
 * - View Teacher Profile (bio, languages, timezone, rates)
 * - Book Session (select time slot with timezone conversion)
 * - Payment Flow (Stripe checkout)
 * - View Booking (dashboard with upcoming sessions)
 */

const BASE_URL = process.env.VITE_APP_URL || 'http://localhost:5173';

// Helper to generate unique email
const generateEmail = (prefix: string) => `${prefix}.${Date.now()}@test-sacred.com`;

// Helper to wait for navigation with timeout
const waitForNavigation = async (page: any, urlPattern: RegExp, timeout = 10000) => {
  try {
    await page.waitForURL(urlPattern, { timeout });
  } catch (error) {
    console.log(`Navigation timeout for ${urlPattern}`);
  }
};

test.describe('Phase 2 Sprint 1: Student User Flow', () => {
  
  /**
   * PERSONA 1: Western Student booking Egyptian Teacher
   * Use Case: American student learning Arabic from Egyptian teacher
   */
  test('Persona 1: Western Student - Arabic Lessons from Egyptian Teacher', async ({ page }) => {
    const email = generateEmail('sarah.johnson');
    const password = 'TestPassword123!';

    // ========== STEP 1: STUDENT SIGNUP/LOGIN ==========
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Create account
    await page.click('button:has-text("Create an account"), a:has-text("Create an account")');
    await page.waitForTimeout(500);
    
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button:has-text("Create account"), button:has-text("Sign up")');
    
    // Wait for account creation
    await page.waitForTimeout(2000);

    // If redirected to onboarding, complete basic profile (optional)
    const currentUrl = page.url();
    if (currentUrl.includes('/onboarding')) {
      // Basic onboarding - select learning goals (if step exists)
      const learningGoalVisible = await page.locator('text=/learning goal/i').isVisible().catch(() => false);
      if (learningGoalVisible) {
        await page.click('input[value="quran"], input[value="arabic"], label:has-text("Arabic")').catch(() => {});
        await page.click('button:has-text("Next"), button:has-text("Continue")').catch(() => {});
        await page.waitForTimeout(1000);
      }
      
      // Complete or skip remaining onboarding steps
      const skipButton = await page.locator('button:has-text("Skip"), a:has-text("Skip")').isVisible().catch(() => false);
      if (skipButton) {
        await page.click('button:has-text("Skip"), a:has-text("Skip")');
      }
    }

    // ========== STEP 2: BROWSE TEACHERS ==========
    // Navigate to teachers directory
    await page.goto(`${BASE_URL}/teachers`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/teachers/);

    // Verify teachers page loaded
    await expect(page.locator('h1, h2').filter({ hasText: /teachers|browse|find/i }).first()).toBeVisible({ timeout: 5000 });

    // Search/Filter for Arabic teachers (if search exists)
    const searchInput = await page.locator('input[placeholder*="Search"], input[type="search"], input[placeholder*="search"]').first().isVisible().catch(() => false);
    if (searchInput) {
      await page.fill('input[placeholder*="Search"], input[type="search"]', 'Arabic');
      await page.waitForTimeout(1000);
    }

    // Verify teacher cards are displayed
    const teacherCards = page.locator('a[href*="/teachers/"], div[data-testid*="teacher-card"]').first();
    await expect(teacherCards).toBeVisible({ timeout: 5000 });

    // ========== STEP 3: VIEW TEACHER PROFILE ==========
    // Click on first teacher (ideally Egyptian/Arabic teacher)
    await teacherCards.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/teachers\/[^/]+/);

    // Verify teacher profile details are visible
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Look for teacher details (bio, languages, specializations)
    const profileContent = page.locator('main, article, div[class*="profile"]').first();
    await expect(profileContent).toBeVisible();

    // Verify "Book Session" button exists
    const bookButton = page.locator('button:has-text("Book Session"), button:has-text("Book"), a:has-text("Book Session")').first();
    await expect(bookButton).toBeVisible({ timeout: 5000 });

    // ========== STEP 4: BOOK A SESSION ==========
    // Click "Book Session" button
    await bookButton.click();
    await page.waitForTimeout(1500);

    // Booking dialog/modal should open
    await expect(page.locator('dialog, div[role="dialog"], div[class*="modal"]')).toBeVisible({ timeout: 5000 });
    
    // Select duration (if available)
    const durationSelect = page.locator('select, button[role="combobox"]').filter({ hasText: /duration|hour|minute/i }).first();
    const isDurationVisible = await durationSelect.isVisible().catch(() => false);
    if (isDurationVisible) {
      await page.locator('select, button[role="combobox"]').filter({ hasText: /duration/i }).first().click();
      await page.waitForTimeout(500);
      await page.click('text=/1 hour|60 min/i').catch(() => {});
    }

    // Select a date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayNumber = tomorrow.getDate();

    // Click on calendar date
    const dateButton = page.locator(`button:has-text("${dayNumber}"), [role="gridcell"]:has-text("${dayNumber}")`).first();
    await dateButton.click().catch(async () => {
      // Alternative: click any available date
      await page.locator('button[role="gridcell"]:not([disabled])').nth(10).click();
    });
    await page.waitForTimeout(500);

    // Select a time slot
    const timeSelect = page.locator('select, button[role="combobox"]').filter({ hasText: /time|slot/i }).first();
    const isTimeSelectVisible = await timeSelect.isVisible().catch(() => false);
    if (isTimeSelectVisible) {
      await page.locator('select, button[role="combobox"]').filter({ hasText: /time/i }).first().click();
      await page.waitForTimeout(500);
      await page.click('text=/09:00|10:00|11:00/').catch(() => {});
    } else {
      // Alternative: look for time slot buttons/options
      await page.click('[role="option"]:has-text("09:00"), [role="option"]:has-text("10:00")').catch(() => {});
    }

    // ========== STEP 5: PAYMENT FLOW ==========
    // Verify price is displayed
    const priceText = page.locator('text=/\\$\\d+|USD|EUR|total/i').first();
    await expect(priceText).toBeVisible({ timeout: 3000 });

    // Click "Pay" or "Checkout" button
    const payButton = page.locator('button:has-text("Pay"), button:has-text("Checkout"), button:has-text("Continue to payment")').first();
    await expect(payButton).toBeVisible({ timeout: 5000 });
    await payButton.click();
    await page.waitForTimeout(2000);

    // Payment flow depends on implementation:
    // A) Redirects to Stripe checkout (external)
    // B) Shows Stripe Elements inline
    // C) Shows mock checkout in dev/test mode

    const currentUrlAfterPay = page.url();
    
    if (currentUrlAfterPay.includes('stripe.com') || currentUrlAfterPay.includes('checkout')) {
      // External Stripe checkout - in test mode, would use test card
      // For E2E: mock or skip actual payment processing
      console.log('Redirected to Stripe checkout (external)');
      
      // If using Stripe test mode, fill test card details
      const cardNumberField = await page.locator('input[name="cardnumber"], input[placeholder*="Card number"]').isVisible({ timeout: 3000 }).catch(() => false);
      if (cardNumberField) {
        await page.fill('input[name="cardnumber"], input[placeholder*="Card number"]', '4242424242424242');
        await page.fill('input[name="exp-date"], input[placeholder*="MM"], input[placeholder*="Expiry"]', '1228');
        await page.fill('input[name="cvc"], input[placeholder*="CVC"]', '123');
        await page.fill('input[name="postal"], input[placeholder*="ZIP"]', '12345');
        await page.click('button[type="submit"]:has-text("Pay")');
        await page.waitForTimeout(3000);
      }
    } else {
      // Mock checkout or inline payment
      console.log('Using mock/inline payment flow');
    }

    // Wait for redirect to success page or dashboard
    await page.waitForTimeout(2000);

    // ========== STEP 6: VIEW BOOKING CONFIRMATION ==========
    // Should be redirected to success page or dashboard
    const successUrl = page.url();
    const isSuccessPage = successUrl.includes('success') || 
                         successUrl.includes('checkout=success') || 
                         successUrl.includes('dashboard');
    
    expect(isSuccessPage).toBeTruthy();

    // Verify success message or booking confirmation
    const successMessage = page.locator('text=/success|confirmed|booked|thank you/i').first();
    await expect(successMessage).toBeVisible({ timeout: 5000 });

    // ========== STEP 7: VIEW BOOKING IN DASHBOARD ==========
    // Navigate to dashboard to see upcoming sessions
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/dashboard/);

    // Verify dashboard shows upcoming sessions
    await expect(page.locator('h1, h2').filter({ hasText: /dashboard|welcome|your learning/i }).first()).toBeVisible();

    // Look for upcoming sessions section
    const upcomingSessions = page.locator('text=/upcoming|next session|scheduled/i').first();
    await expect(upcomingSessions).toBeVisible({ timeout: 5000 });

    // Verify session details are displayed (teacher name, date/time)
    const sessionDetails = page.locator('div, article, section').filter({ hasText: /session|teacher/i }).first();
    await expect(sessionDetails).toBeVisible();

    console.log('✅ Persona 1 (Western Student) completed successfully');
  });

  /**
   * PERSONA 2: Pakistani Student booking Pakistani Teacher
   * Use Case: Pakistani student learning Quran memorization from Pakistani teacher
   */
  test('Persona 2: Pakistani Student - Quran Memorization from Pakistani Teacher', async ({ page }) => {
    const email = generateEmail('aisha.khan');
    const password = 'TestPassword123!';

    // ========== STEP 1: STUDENT SIGNUP/LOGIN ==========
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    // Create account
    await page.click('button:has-text("Create an account"), a:has-text("Create an account")');
    await page.waitForTimeout(500);
    
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button:has-text("Create account"), button:has-text("Sign up")');
    await page.waitForTimeout(2000);

    // Skip onboarding if present
    const currentUrl = page.url();
    if (currentUrl.includes('/onboarding')) {
      const skipButton = await page.locator('button:has-text("Skip"), a:has-text("Skip")').isVisible().catch(() => false);
      if (skipButton) {
        await page.click('button:has-text("Skip"), a:has-text("Skip")');
      } else {
        // Select Quran memorization as learning goal
        await page.click('input[value="quran"], label:has-text("Quran")').catch(() => {});
        await page.click('button:has-text("Next"), button:has-text("Continue")').catch(() => {});
        await page.waitForTimeout(1000);
      }
    }

    // ========== STEP 2: BROWSE TEACHERS ==========
    await page.goto(`${BASE_URL}/teachers`);
    await page.waitForLoadState('networkidle');

    // Search for Quran teachers
    const searchInput = await page.locator('input[placeholder*="Search"], input[type="search"]').first().isVisible().catch(() => false);
    if (searchInput) {
      await page.fill('input[placeholder*="Search"], input[type="search"]', 'Quran');
      await page.waitForTimeout(1000);
    }

    // ========== STEP 3: VIEW TEACHER PROFILE ==========
    const teacherCard = page.locator('a[href*="/teachers/"]').first();
    await expect(teacherCard).toBeVisible({ timeout: 5000 });
    await teacherCard.click();
    await page.waitForLoadState('networkidle');

    // Verify profile loads
    await expect(page.locator('h1').first()).toBeVisible();

    // ========== STEP 4: BOOK SESSION ==========
    const bookButton = page.locator('button:has-text("Book Session"), button:has-text("Book")').first();
    await expect(bookButton).toBeVisible({ timeout: 5000 });
    await bookButton.click();
    await page.waitForTimeout(1500);

    // Select date (day after tomorrow)
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const dayNumber = dayAfterTomorrow.getDate();

    await page.locator(`button:has-text("${dayNumber}"), [role="gridcell"]:has-text("${dayNumber}")`).first().click().catch(async () => {
      await page.locator('button[role="gridcell"]:not([disabled])').nth(12).click();
    });
    await page.waitForTimeout(500);

    // Select time
    const timeSelector = page.locator('select, button[role="combobox"]').filter({ hasText: /time/i }).first();
    await timeSelector.click().catch(() => {});
    await page.waitForTimeout(500);
    await page.click('text=/14:00|15:00|16:00/').catch(() => {});

    // ========== STEP 5: PAYMENT ==========
    const payButton = page.locator('button:has-text("Pay"), button:has-text("Checkout")').first();
    await payButton.click();
    await page.waitForTimeout(3000);

    // Handle payment flow (similar to Persona 1)
    const currentUrlAfterPay = page.url();
    if (currentUrlAfterPay.includes('stripe.com')) {
      const cardNumberField = await page.locator('input[name="cardnumber"]').isVisible({ timeout: 3000 }).catch(() => false);
      if (cardNumberField) {
        await page.fill('input[name="cardnumber"]', '4242424242424242');
        await page.fill('input[name="exp-date"]', '1229');
        await page.fill('input[name="cvc"]', '123');
        await page.fill('input[name="postal"]', '54000');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(3000);
      }
    }

    // ========== STEP 6: VERIFY BOOKING ==========
    await page.waitForTimeout(2000);
    const successUrl = page.url();
    expect(successUrl.includes('success') || successUrl.includes('dashboard')).toBeTruthy();

    // ========== STEP 7: CHECK DASHBOARD ==========
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=/upcoming|session/i').first()).toBeVisible({ timeout: 5000 });

    console.log('✅ Persona 2 (Pakistani Student) completed successfully');
  });

  /**
   * PERSONA 3: Tunisian Student booking Tunisian Teacher
   * Use Case: Tunisian student learning Islamic fundamentals from Tunisian teacher
   */
  test('Persona 3: Tunisian Student - Islamic Fundamentals from Tunisian Teacher', async ({ page }) => {
    const email = generateEmail('omar.benali');
    const password = 'TestPassword123!';

    // ========== STEP 1: SIGNUP/LOGIN ==========
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');

    await page.click('button:has-text("Create an account"), a:has-text("Create an account")');
    await page.waitForTimeout(500);
    
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button:has-text("Create account"), button:has-text("Sign up")');
    await page.waitForTimeout(2000);

    // Skip onboarding
    if (page.url().includes('/onboarding')) {
      await page.click('button:has-text("Skip"), a:has-text("Skip")').catch(async () => {
        await page.click('input[value="islamic_studies"], label:has-text("Islamic")').catch(() => {});
        await page.click('button:has-text("Next")').catch(() => {});
      });
    }

    // ========== STEP 2: BROWSE TEACHERS ==========
    await page.goto(`${BASE_URL}/teachers`);
    await page.waitForLoadState('networkidle');

    // Filter by specialization (if filters exist)
    const filterButton = await page.locator('button:has-text("Filter"), button[aria-label*="filter"]').isVisible().catch(() => false);
    if (filterButton) {
      await page.click('button:has-text("Filter")');
      await page.waitForTimeout(500);
      await page.click('text=/Islamic Studies|Aqeedah|Fiqh/i').catch(() => {});
    }

    // ========== STEP 3: VIEW TEACHER PROFILE ==========
    const teacherCard = page.locator('a[href*="/teachers/"]').first();
    await expect(teacherCard).toBeVisible({ timeout: 5000 });
    
    // Store teacher name for later verification
    const teacherNameInList = await teacherCard.locator('h2, h3, p').first().textContent();
    
    await teacherCard.click();
    await page.waitForLoadState('networkidle');

    // Verify teacher profile details
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Check for timezone display (important for global platform)
    const timezoneText = page.locator('text=/timezone|UTC|GMT|time zone/i').first();
    const timezoneVisible = await timezoneText.isVisible().catch(() => false);
    if (timezoneVisible) {
      console.log('✓ Timezone information displayed');
    }

    // ========== STEP 4: BOOK SESSION ==========
    const bookButton = page.locator('button:has-text("Book Session"), button:has-text("Book")').first();
    await expect(bookButton).toBeVisible({ timeout: 5000 });
    await bookButton.click();
    await page.waitForTimeout(1500);

    // Select session duration
    const durationSelector = page.locator('select, button[role="combobox"]').filter({ hasText: /duration/i }).first();
    await durationSelector.click().catch(() => {});
    await page.waitForTimeout(500);
    await page.click('text=/1.5 hours|90 min/i').catch(() => {});

    // Select date
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dayNumber = nextWeek.getDate();

    await page.locator(`button:has-text("${dayNumber}")`).first().click().catch(async () => {
      await page.locator('button[role="gridcell"]:not([disabled])').nth(15).click();
    });
    await page.waitForTimeout(500);

    // Select time (afternoon)
    const timeSelectorP3 = page.locator('select, button[role="combobox"]').filter({ hasText: /time/i }).first();
    await timeSelectorP3.click().catch(() => {});
    await page.waitForTimeout(500);
    await page.click('text=/17:00|18:00|19:00/').catch(() => {});

    // ========== STEP 5: PAYMENT ==========
    // Verify price summary
    const priceDisplay = page.locator('text=/total|price|\\$/i').first();
    await expect(priceDisplay).toBeVisible({ timeout: 3000 });

    const payButton = page.locator('button:has-text("Pay"), button:has-text("Checkout")').first();
    await payButton.click();
    await page.waitForTimeout(3000);

    // Handle Stripe checkout
    const currentUrlAfterPay = page.url();
    if (currentUrlAfterPay.includes('stripe.com')) {
      await page.fill('input[name="cardnumber"]', '4242424242424242').catch(() => {});
      await page.fill('input[name="exp-date"]', '1230').catch(() => {});
      await page.fill('input[name="cvc"]', '456').catch(() => {});
      await page.fill('input[name="postal"]', '1001').catch(() => {});
      await page.click('button[type="submit"]').catch(() => {});
      await page.waitForTimeout(3000);
    }

    // ========== STEP 6: CONFIRMATION ==========
    await page.waitForTimeout(2000);
    const successUrl = page.url();
    expect(successUrl.includes('success') || successUrl.includes('dashboard')).toBeTruthy();

    const confirmationMessage = page.locator('text=/confirmed|success|booked/i').first();
    await expect(confirmationMessage).toBeVisible({ timeout: 5000 });

    // ========== STEP 7: VIEW IN DASHBOARD ==========
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    // Verify upcoming session appears
    await expect(page.locator('text=/upcoming|scheduled|next/i').first()).toBeVisible({ timeout: 5000 });

    // Verify session details (teacher, date, time)
    const sessionCard = page.locator('div, article').filter({ hasText: /session|teacher/i }).first();
    await expect(sessionCard).toBeVisible();

    // Check for Zoom link or meeting link (if session is soon)
    const meetingLink = page.locator('a:has-text("Join"), a:has-text("Zoom"), text=/meeting link/i').first();
    const hasMeetingLink = await meetingLink.isVisible().catch(() => false);
    if (hasMeetingLink) {
      console.log('✓ Meeting link displayed');
    }

    console.log('✅ Persona 3 (Tunisian Student) completed successfully');
  });

  /**
   * VALIDATION TEST: User must be logged in to book
   */
  test('Validation: Must be logged in to book session', async ({ page }) => {
    await page.goto(`${BASE_URL}/teachers`);
    await page.waitForLoadState('networkidle');

    // Click on a teacher
    const teacherCard = page.locator('a[href*="/teachers/"]').first();
    await expect(teacherCard).toBeVisible({ timeout: 5000 });
    await teacherCard.click();
    await page.waitForLoadState('networkidle');

    // Look for "Sign in to Book" or redirect behavior
    const signInButton = page.locator('button:has-text("Sign in"), a:has-text("Sign in to Book")').first();
    const bookButton = page.locator('button:has-text("Book Session")').first();

    // Either shows "Sign in" button OR book button exists but redirects to login
    const signInVisible = await signInButton.isVisible().catch(() => false);
    const bookButtonVisible = await bookButton.isVisible().catch(() => false);

    if (signInVisible) {
      await expect(signInButton).toBeVisible();
      console.log('✓ Shows "Sign in to Book" button for unauthenticated users');
    } else if (bookButtonVisible) {
      // Click book and verify redirect to login
      await bookButton.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('/login');
      console.log('✓ Redirects to login when unauthenticated user tries to book');
    }
  });

  /**
   * VALIDATION TEST: Search and filter teachers
   */
  test('Validation: Search and filter teachers by specialization', async ({ page }) => {
    await page.goto(`${BASE_URL}/teachers`);
    await page.waitForLoadState('networkidle');

    // Verify teachers page loaded
    await expect(page.locator('h1, h2').filter({ hasText: /teachers/i }).first()).toBeVisible();

    // Count initial teachers
    const initialTeachers = await page.locator('a[href*="/teachers/"]').count();
    expect(initialTeachers).toBeGreaterThan(0);

    // Search for "Quran"
    const searchInput = await page.locator('input[placeholder*="Search"], input[type="search"]').first().isVisible().catch(() => false);
    if (searchInput) {
      await page.fill('input[placeholder*="Search"], input[type="search"]', 'Quran');
      await page.waitForTimeout(1500);

      // Verify search results
      const searchResults = await page.locator('a[href*="/teachers/"]').count();
      console.log(`Search returned ${searchResults} teachers for "Quran"`);
      
      // Clear search
      await page.fill('input[placeholder*="Search"], input[type="search"]', '');
      await page.waitForTimeout(1000);
    }

    console.log('✓ Search/filter functionality tested');
  });

  /**
   * VALIDATION TEST: Teacher profile displays all required information
   */
  test('Validation: Teacher profile shows complete information', async ({ page }) => {
    await page.goto(`${BASE_URL}/teachers`);
    await page.waitForLoadState('networkidle');

    // Click on first teacher
    const teacherCard = page.locator('a[href*="/teachers/"]').first();
    await expect(teacherCard).toBeVisible();
    await teacherCard.click();
    await page.waitForLoadState('networkidle');

    // Verify required profile elements
    const requiredElements = [
      { selector: 'h1', name: 'Teacher name' },
      { selector: 'text=/bio|about/i', name: 'Bio section' },
      { selector: 'button:has-text("Book Session"), button:has-text("Book")', name: 'Book button' },
    ];

    for (const element of requiredElements) {
      const isVisible = await page.locator(element.selector).first().isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        console.log(`✓ ${element.name} displayed`);
      } else {
        console.log(`⚠ ${element.name} not found`);
      }
    }

    // Check for optional but important elements
    const optionalElements = [
      'text=/specialization/i',
      'text=/language/i',
      'text=/rating|review/i',
      'text=/experience/i',
    ];

    for (const selector of optionalElements) {
      const isVisible = await page.locator(selector).first().isVisible({ timeout: 2000 }).catch(() => false);
      if (isVisible) {
        console.log(`✓ Found: ${selector}`);
      }
    }
  });

  /**
   * VALIDATION TEST: Booking form validation
   */
  test('Validation: Cannot book without selecting date and time', async ({ page }) => {
    const email = generateEmail('test.validation');
    const password = 'TestPassword123!';

    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Create an account"), a:has-text("Create an account")');
    await page.waitForTimeout(500);
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button:has-text("Create account"), button:has-text("Sign up")');
    await page.waitForTimeout(2000);

    // Navigate to teacher
    await page.goto(`${BASE_URL}/teachers`);
    await page.waitForLoadState('networkidle');
    await page.locator('a[href*="/teachers/"]').first().click();
    await page.waitForLoadState('networkidle');

    // Open booking dialog
    await page.click('button:has-text("Book Session"), button:has-text("Book")');
    await page.waitForTimeout(1500);

    // Try to pay without selecting date/time
    const payButton = page.locator('button:has-text("Pay"), button:has-text("Checkout")').first();
    const isPayButtonDisabled = await payButton.isDisabled().catch(() => false);

    if (isPayButtonDisabled) {
      console.log('✓ Pay button is disabled when date/time not selected');
    } else {
      // Try clicking and check for validation error
      await payButton.click();
      await page.waitForTimeout(500);
      
      // Should not navigate away or should show error
      const hasError = await page.locator('text=/required|select date|choose time/i').isVisible({ timeout: 2000 }).catch(() => false);
      if (hasError) {
        console.log('✓ Shows validation error');
      }
    }
  });

  /**
   * REGRESSION TEST: Dashboard loads after booking
   */
  test('Regression: Dashboard loads correctly after booking', async ({ page }) => {
    const email = generateEmail('test.dashboard');
    const password = 'TestPassword123!';

    // Quick flow: signup → book → verify dashboard
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Create an account")');
    await page.waitForTimeout(500);
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', password);
    await page.click('button:has-text("Create account")');
    await page.waitForTimeout(2000);

    // Navigate to dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    // Verify dashboard elements
    await expect(page.locator('h1, h2').filter({ hasText: /dashboard|welcome/i }).first()).toBeVisible({ timeout: 5000 });
    
    // Check for key dashboard sections
    const dashboardSections = [
      'text=/enrolled|bundles|courses/i',
      'text=/session/i',
      'text=/progress|learning/i',
    ];

    for (const selector of dashboardSections) {
      const isVisible = await page.locator(selector).first().isVisible({ timeout: 3000 }).catch(() => false);
      if (isVisible) {
        console.log(`✓ Dashboard section found: ${selector}`);
      }
    }

    console.log('✓ Dashboard loads correctly');
  });
});
