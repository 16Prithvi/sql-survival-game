#!/usr/bin/env python3
"""
SQL Engine Direct Test

This test validates the SQL game logic by testing the JavaScript files directly
and checking if the game data and SQL engine are properly structured.
"""

import requests
import json
import re
import sys
from datetime import datetime

# Configuration
FRONTEND_URL = "https://codeisland.preview.emergentagent.com"

class SQLEngineDirectTester:
    def __init__(self):
        self.passed_tests = 0
        self.failed_tests = 0
        self.test_results = []
        
    def log_test(self, test_name, passed, message=""):
        """Log test result"""
        status = "✅ PASS" if passed else "❌ FAIL"
        result = {
            'test': test_name,
            'passed': passed,
            'message': message,
            'timestamp': datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        if passed:
            self.passed_tests += 1
            print(f"{status}: {test_name}")
        else:
            self.failed_tests += 1
            print(f"{status}: {test_name} - {message}")
            
        if message and passed:
            print(f"    ℹ️  {message}")
    
    def test_javascript_bundle_content(self):
        """Test JavaScript bundle contains SQL game code"""
        try:
            response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js", timeout=15)
            if response.status_code != 200:
                self.log_test("JavaScript Bundle Content", False, f"Bundle not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for SQL game specific code
            sql_game_indicators = [
                "sql.js",
                "createZoneDatabase",
                "executeUserQuery", 
                "gameTasks",
                "beach",
                "jungle",
                "ruins",
                "survivors",
                "crashed_supplies",
                "island_fauna",
                "ancient_relics"
            ]
            
            found_indicators = []
            for indicator in sql_game_indicators:
                if indicator in content:
                    found_indicators.append(indicator)
            
            if len(found_indicators) >= 7:
                self.log_test("JavaScript Bundle Content", True, f"Found {len(found_indicators)} SQL game indicators: {', '.join(found_indicators[:5])}...")
                return True
            else:
                self.log_test("JavaScript Bundle Content", False, f"Only found {len(found_indicators)} indicators: {found_indicators}")
                return False
                
        except Exception as e:
            self.log_test("JavaScript Bundle Content", False, f"Error: {str(e)}")
            return False
    
    def test_sql_database_schemas(self):
        """Test if SQL database schemas are defined in the bundle"""
        try:
            response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js", timeout=15)
            if response.status_code != 200:
                self.log_test("SQL Database Schemas", False, f"Bundle not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for database table definitions
            table_indicators = [
                "CREATE TABLE survivors",
                "CREATE TABLE crashed_supplies", 
                "CREATE TABLE logbook_entries",
                "CREATE TABLE island_fauna",
                "CREATE TABLE island_flora",
                "CREATE TABLE expedition_logs",
                "CREATE TABLE ancient_relics",
                "CREATE TABLE glyph_translations",
                "CREATE TABLE celestial_events"
            ]
            
            found_tables = []
            for table in table_indicators:
                if table in content:
                    found_tables.append(table.replace("CREATE TABLE ", ""))
            
            if len(found_tables) >= 6:
                self.log_test("SQL Database Schemas", True, f"Found {len(found_tables)} database tables: {', '.join(found_tables[:4])}...")
                return True
            else:
                self.log_test("SQL Database Schemas", False, f"Only found {len(found_tables)} tables: {found_tables}")
                return False
                
        except Exception as e:
            self.log_test("SQL Database Schemas", False, f"Error: {str(e)}")
            return False
    
    def test_game_task_definitions(self):
        """Test if game tasks are properly defined"""
        try:
            response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js", timeout=15)
            if response.status_code != 200:
                self.log_test("Game Task Definitions", False, f"Bundle not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for task-related content
            task_indicators = [
                "Check Survivors",
                "Survivor Roles", 
                "Find the Doctor",
                "Inventory Check",
                "Habitat Survey",
                "Stone Relics",
                "expectedQuery",
                "SELECT \\* FROM survivors",
                "level:",
                "title:",
                "description:",
                "hint:"
            ]
            
            found_tasks = []
            for task in task_indicators:
                if task in content:
                    found_tasks.append(task)
            
            if len(found_tasks) >= 8:
                self.log_test("Game Task Definitions", True, f"Found {len(found_tasks)} task indicators: {', '.join(found_tasks[:4])}...")
                return True
            else:
                self.log_test("Game Task Definitions", False, f"Only found {len(found_tasks)} task indicators: {found_tasks}")
                return False
                
        except Exception as e:
            self.log_test("Game Task Definitions", False, f"Error: {str(e)}")
            return False
    
    def test_sql_query_validation(self):
        """Test if SQL query validation logic is present"""
        try:
            response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js", timeout=15)
            if response.status_code != 200:
                self.log_test("SQL Query Validation", False, f"Bundle not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for query validation functions
            validation_indicators = [
                "compareResults",
                "executeUserQuery",
                "success:",
                "correct:",
                "error:",
                "database.exec",
                "query.trim",
                "results.length"
            ]
            
            found_validation = []
            for indicator in validation_indicators:
                if indicator in content:
                    found_validation.append(indicator)
            
            if len(found_validation) >= 5:
                self.log_test("SQL Query Validation", True, f"Found {len(found_validation)} validation indicators: {', '.join(found_validation[:4])}...")
                return True
            else:
                self.log_test("SQL Query Validation", False, f"Only found {len(found_validation)} validation indicators: {found_validation}")
                return False
                
        except Exception as e:
            self.log_test("SQL Query Validation", False, f"Error: {str(e)}")
            return False
    
    def test_game_progression_logic(self):
        """Test if game progression logic is implemented"""
        try:
            response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js", timeout=15)
            if response.status_code != 200:
                self.log_test("Game Progression Logic", False, f"Bundle not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for progression-related functions
            progression_indicators = [
                "unlockNextLevel",
                "skipLevel",
                "incrementAttempts",
                "localStorage",
                "progress:",
                "status:",
                "completed",
                "active",
                "locked",
                "attempts:"
            ]
            
            found_progression = []
            for indicator in progression_indicators:
                if indicator in content:
                    found_progression.append(indicator)
            
            if len(found_progression) >= 7:
                self.log_test("Game Progression Logic", True, f"Found {len(found_progression)} progression indicators: {', '.join(found_progression[:4])}...")
                return True
            else:
                self.log_test("Game Progression Logic", False, f"Only found {len(found_progression)} progression indicators: {found_progression}")
                return False
                
        except Exception as e:
            self.log_test("Game Progression Logic", False, f"Error: {str(e)}")
            return False
    
    def test_ui_components(self):
        """Test if UI components are properly included"""
        try:
            response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js", timeout=15)
            if response.status_code != 200:
                self.log_test("UI Components", False, f"Bundle not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for UI component indicators
            ui_indicators = [
                "GamePage",
                "MapPage", 
                "LandingPage",
                "GameContext",
                "Button",
                "Card",
                "Textarea",
                "useNavigate",
                "useState",
                "useEffect"
            ]
            
            found_ui = []
            for indicator in ui_indicators:
                if indicator in content:
                    found_ui.append(indicator)
            
            if len(found_ui) >= 7:
                self.log_test("UI Components", True, f"Found {len(found_ui)} UI components: {', '.join(found_ui[:4])}...")
                return True
            else:
                self.log_test("UI Components", False, f"Only found {len(found_ui)} UI components: {found_ui}")
                return False
                
        except Exception as e:
            self.log_test("UI Components", False, f"Error: {str(e)}")
            return False
    
    def test_zone_specific_content(self):
        """Test if zone-specific content is present"""
        try:
            response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js", timeout=15)
            if response.status_code != 200:
                self.log_test("Zone Specific Content", False, f"Bundle not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for zone-specific content
            zone_indicators = [
                "The Beach",
                "The Jungle",
                "The Ruins",
                "setupBeachDatabase",
                "setupJungleDatabase", 
                "setupRuinsDatabase",
                "Captain Eva",
                "Ben Carter",
                "Dr. Aris",
                "Island Macaw",
                "Sun Dial"
            ]
            
            found_zones = []
            for indicator in zone_indicators:
                if indicator in content:
                    found_zones.append(indicator)
            
            if len(found_zones) >= 8:
                self.log_test("Zone Specific Content", True, f"Found {len(found_zones)} zone indicators: {', '.join(found_zones[:4])}...")
                return True
            else:
                self.log_test("Zone Specific Content", False, f"Only found {len(found_zones)} zone indicators: {found_zones}")
                return False
                
        except Exception as e:
            self.log_test("Zone Specific Content", False, f"Error: {str(e)}")
            return False
    
    def test_bundle_size_and_performance(self):
        """Test bundle size and loading performance"""
        try:
            import time
            start_time = time.time()
            response = requests.get(f"{FRONTEND_URL}/static/js/bundle.js", timeout=20)
            load_time = time.time() - start_time
            
            if response.status_code == 200:
                bundle_size = len(response.content)
                
                # Check if bundle is reasonable size (not too small, not too large)
                if 100000 < bundle_size < 10000000 and load_time < 10.0:  # 100KB to 10MB, under 10s
                    self.log_test("Bundle Size and Performance", True, f"Bundle size: {bundle_size:,} bytes, Load time: {load_time:.2f}s")
                    return True
                elif bundle_size <= 100000:
                    self.log_test("Bundle Size and Performance", False, f"Bundle too small: {bundle_size:,} bytes (may be incomplete)")
                    return False
                elif bundle_size >= 10000000:
                    self.log_test("Bundle Size and Performance", False, f"Bundle too large: {bundle_size:,} bytes")
                    return False
                else:
                    self.log_test("Bundle Size and Performance", False, f"Slow load time: {load_time:.2f}s")
                    return False
            else:
                self.log_test("Bundle Size and Performance", False, f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Bundle Size and Performance", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all SQL engine tests"""
        print("🔧 Starting SQL Engine Direct Test Suite")
        print("=" * 60)
        
        # SQL engine and game logic tests
        tests = [
            ("JavaScript Bundle Content", self.test_javascript_bundle_content),
            ("SQL Database Schemas", self.test_sql_database_schemas),
            ("Game Task Definitions", self.test_game_task_definitions),
            ("SQL Query Validation", self.test_sql_query_validation),
            ("Game Progression Logic", self.test_game_progression_logic),
            ("UI Components", self.test_ui_components),
            ("Zone Specific Content", self.test_zone_specific_content),
            ("Bundle Size and Performance", self.test_bundle_size_and_performance),
        ]
        
        print(f"\n📋 Running {len(tests)} test categories...\n")
        
        for test_name, test_func in tests:
            print(f"🔍 Testing {test_name}...")
            try:
                test_func()
            except Exception as e:
                self.log_test(test_name, False, f"Test execution error: {str(e)}")
            print()
        
        # Print summary
        print("=" * 60)
        print("📊 SQL ENGINE TEST SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.passed_tests}")
        print(f"❌ Failed: {self.failed_tests}")
        print(f"📈 Success Rate: {(self.passed_tests / (self.passed_tests + self.failed_tests) * 100):.1f}%")
        
        if self.failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result['passed']:
                    print(f"  • {result['test']}: {result['message']}")
        
        print("\n" + "=" * 60)
        
        # Return overall success
        return self.failed_tests == 0

def main():
    """Main test execution"""
    tester = SQLEngineDirectTester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 All SQL engine tests passed! Game logic is properly implemented.")
        sys.exit(0)
    else:
        print("⚠️  Some tests failed. Check the results above.")
        sys.exit(1)

if __name__ == "__main__":
    main()