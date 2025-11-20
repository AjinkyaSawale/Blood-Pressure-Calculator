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


