Scenario: Calculate Mean Arterial Pressure (MAP)
  Given I open the Blood Pressure Calculator
  When I enter systolic "120" and diastolic "80"
  And I press Calculate
  Then I should see "MAP: 93 mmHg"

  Scenario: Calculate MAP value
  Given I open the Blood Pressure Calculator
  When I enter systolic "120" and diastolic "80"
  And I click calculate
  Then I should see "MAP"

  Scenario: Elevated blood pressure result
  Given I am on the blood pressure calculator page
  When I enter systolic "125" and diastolic "82"
  And I click calculate
  Then I should see "Category: Elevated"

Scenario: Low blood pressure result
  Given I open the blood pressure calculator
  When I enter systolic "85" and diastolic "55"
  And I click calculate
  Then I should see "Category: Low"

  Scenario: See MAP value for a normal reading
  Given I open the blood pressure calculator
  When I enter systolic 120 and diastolic 80
  And I press Calculate
  Then I should see "MAP"

  Scenario: Low blood pressure classification
  Given I open the blood pressure calculator
  When I enter systolic "85" and diastolic "55"
  And I click calculate
  Then I should see "Low"

  Scenario: Detecting wide pulse pressure
  Given I open the blood pressure calculator
  When I enter systolic "150" and diastolic "70"
  And I press calculate
  Then I should see "Pulse pressure: 80"
  And I should see "(Wide)"

  Scenario: Invalid reading shows an error message
  Given I am on the blood pressure calculator page
  When I enter systolic "120" and diastolic "120" and press calculate
  Then I should see "Invalid blood pressure input."






