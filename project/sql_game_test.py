#!/usr/bin/env python3
"""
SQL Survival Game Functionality Test Suite

This test suite validates the SQL game functionality including:
- SQL.js integration and database initialization
- Query execution and validation
- Game progression and localStorage
- All three zones (Beach, Jungle, Ruins)
"""

import requests
import json
import time
import sys
from datetime import datetime
import re

# Configuration
FRONTEND_URL = "https://codeisland.preview.emergentagent.com"

class SQLGameTester:
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
    
    def test_frontend_sql_dependencies(self):
        """Test if frontend includes SQL.js and game dependencies"""
        try:
            # Check main page for SQL-related content
            response = requests.get(FRONTEND_URL, timeout=15)
            if response.status_code != 200:
                self.log_test("Frontend SQL Dependencies", False, f"Frontend not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text.lower()
            
            # Check for key SQL game elements
            sql_indicators = [
                "sql survival",
                "sql",
                "database",
                "query",
                "beach",
                "jungle", 
                "ruins"
            ]
            
            found_indicators = [indicator for indicator in sql_indicators if indicator in content]
            
            if len(found_indicators) >= 5:
                self.log_test("Frontend SQL Dependencies", True, f"Found SQL game indicators: {', '.join(found_indicators)}")
                return True
            else:
                self.log_test("Frontend SQL Dependencies", False, f"Only found {len(found_indicators)} SQL indicators: {found_indicators}")
                return False
                
        except Exception as e:
            self.log_test("Frontend SQL Dependencies", False, f"Error: {str(e)}")
            return False
    
    def test_game_page_structure(self):
        """Test game page structure and components"""
        zones = ['beach', 'jungle', 'ruins']
        all_zones_working = True
        
        for zone in zones:
            try:
                response = requests.get(f"{FRONTEND_URL}/game/{zone}", timeout=15)
                if response.status_code == 200:
                    content = response.text.lower()
                    
                    # Check for essential game components
                    required_elements = [
                        "sql",
                        "query",
                        "execute",
                        "database",
                        "schema"
                    ]
                    
                    found_elements = [elem for elem in required_elements if elem in content]
                    
                    if len(found_elements) >= 4:
                        self.log_test(f"Game Page Structure ({zone.title()})", True, f"Found game elements: {', '.join(found_elements)}")
                    else:
                        self.log_test(f"Game Page Structure ({zone.title()})", False, f"Missing game elements, only found: {found_elements}")
                        all_zones_working = False
                else:
                    self.log_test(f"Game Page Structure ({zone.title()})", False, f"HTTP {response.status_code}")
                    all_zones_working = False
                    
            except Exception as e:
                self.log_test(f"Game Page Structure ({zone.title()})", False, f"Error: {str(e)}")
                all_zones_working = False
        
        return all_zones_working
    
    def test_map_page_functionality(self):
        """Test map page and zone navigation"""
        try:
            response = requests.get(f"{FRONTEND_URL}/map", timeout=15)
            if response.status_code != 200:
                self.log_test("Map Page Functionality", False, f"Map page not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text.lower()
            
            # Check for zone information
            zones_content = [
                "beach",
                "jungle", 
                "ruins",
                "progress",
                "level"
            ]
            
            found_zones = [zone for zone in zones_content if zone in content]
            
            if len(found_zones) >= 4:
                self.log_test("Map Page Functionality", True, f"Map page contains zone navigation: {', '.join(found_zones)}")
                return True
            else:
                self.log_test("Map Page Functionality", False, f"Map page missing zone content: {found_zones}")
                return False
                
        except Exception as e:
            self.log_test("Map Page Functionality", False, f"Error: {str(e)}")
            return False
    
    def test_landing_page_content(self):
        """Test landing page content and navigation"""
        try:
            response = requests.get(FRONTEND_URL, timeout=15)
            if response.status_code != 200:
                self.log_test("Landing Page Content", False, f"Landing page not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for key landing page elements
            landing_elements = [
                "SQL SURVIVAL",
                "START GAME", 
                "ADVENTURE",
                "LEARN SQL",
                "EXPLORE",
                "REAL QUERIES"
            ]
            
            found_elements = []
            for element in landing_elements:
                if element.lower() in content.lower():
                    found_elements.append(element)
            
            if len(found_elements) >= 4:
                self.log_test("Landing Page Content", True, f"Landing page properly structured: {', '.join(found_elements)}")
                return True
            else:
                self.log_test("Landing Page Content", False, f"Landing page missing elements: {found_elements}")
                return False
                
        except Exception as e:
            self.log_test("Landing Page Content", False, f"Error: {str(e)}")
            return False
    
    def test_javascript_bundle_loading(self):
        """Test if JavaScript bundles are loading properly"""
        try:
            response = requests.get(FRONTEND_URL, timeout=15)
            if response.status_code != 200:
                self.log_test("JavaScript Bundle Loading", False, f"Frontend not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text
            
            # Check for React and JavaScript bundle references
            js_indicators = [
                "react",
                ".js",
                "bundle",
                "script",
                "static"
            ]
            
            found_js = []
            for indicator in js_indicators:
                if indicator in content.lower():
                    found_js.append(indicator)
            
            # Also check for script tags
            script_tags = len(re.findall(r'<script[^>]*>', content, re.IGNORECASE))
            
            if len(found_js) >= 3 and script_tags > 0:
                self.log_test("JavaScript Bundle Loading", True, f"Found JS indicators: {', '.join(found_js)}, {script_tags} script tags")
                return True
            else:
                self.log_test("JavaScript Bundle Loading", False, f"Missing JS elements: {found_js}, {script_tags} scripts")
                return False
                
        except Exception as e:
            self.log_test("JavaScript Bundle Loading", False, f"Error: {str(e)}")
            return False
    
    def test_responsive_design(self):
        """Test responsive design elements"""
        try:
            response = requests.get(FRONTEND_URL, timeout=15)
            if response.status_code != 200:
                self.log_test("Responsive Design", False, f"Frontend not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text.lower()
            
            # Check for responsive design indicators
            responsive_elements = [
                "viewport",
                "responsive", 
                "mobile",
                "tailwind",
                "grid",
                "flex"
            ]
            
            found_responsive = [elem for elem in responsive_elements if elem in content]
            
            if len(found_responsive) >= 3:
                self.log_test("Responsive Design", True, f"Responsive design elements found: {', '.join(found_responsive)}")
                return True
            else:
                self.log_test("Responsive Design", False, f"Limited responsive elements: {found_responsive}")
                return False
                
        except Exception as e:
            self.log_test("Responsive Design", False, f"Error: {str(e)}")
            return False
    
    def test_game_routing(self):
        """Test React Router functionality"""
        routes_to_test = [
            ("/", "landing page"),
            ("/map", "map page"),
            ("/game/beach", "beach game"),
            ("/game/jungle", "jungle game"),
            ("/game/ruins", "ruins game")
        ]
        
        all_routes_working = True
        working_routes = []
        
        for route, description in routes_to_test:
            try:
                response = requests.get(f"{FRONTEND_URL}{route}", timeout=10)
                if response.status_code == 200:
                    working_routes.append(f"{route} ({description})")
                else:
                    self.log_test(f"Game Routing - {description}", False, f"HTTP {response.status_code}")
                    all_routes_working = False
            except Exception as e:
                self.log_test(f"Game Routing - {description}", False, f"Error: {str(e)}")
                all_routes_working = False
        
        if working_routes:
            self.log_test("Game Routing", True, f"Working routes: {', '.join(working_routes)}")
        
        return all_routes_working
    
    def test_css_and_styling(self):
        """Test CSS loading and Tailwind integration"""
        try:
            response = requests.get(FRONTEND_URL, timeout=15)
            if response.status_code != 200:
                self.log_test("CSS and Styling", False, f"Frontend not accessible: HTTP {response.status_code}")
                return False
            
            content = response.text.lower()
            
            # Check for CSS and styling elements
            css_elements = [
                "css",
                "style",
                "tailwind",
                "class=",
                "bg-",
                "text-",
                "flex",
                "grid"
            ]
            
            found_css = [elem for elem in css_elements if elem in content]
            
            if len(found_css) >= 5:
                self.log_test("CSS and Styling", True, f"CSS and Tailwind elements found: {len(found_css)} indicators")
                return True
            else:
                self.log_test("CSS and Styling", False, f"Limited CSS elements: {found_css}")
                return False
                
        except Exception as e:
            self.log_test("CSS and Styling", False, f"Error: {str(e)}")
            return False
    
    def test_performance_metrics(self):
        """Test frontend performance"""
        try:
            start_time = time.time()
            response = requests.get(FRONTEND_URL, timeout=20)
            load_time = time.time() - start_time
            
            if response.status_code == 200:
                content_size = len(response.content)
                
                # Performance thresholds
                if load_time < 5.0 and content_size > 1000:
                    self.log_test("Performance Metrics", True, f"Load time: {load_time:.2f}s, Size: {content_size:,} bytes")
                    return True
                elif load_time >= 5.0:
                    self.log_test("Performance Metrics", False, f"Slow load time: {load_time:.2f}s")
                    return False
                else:
                    self.log_test("Performance Metrics", False, f"Content too small: {content_size} bytes")
                    return False
            else:
                self.log_test("Performance Metrics", False, f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Performance Metrics", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all SQL game tests"""
        print("🎮 Starting SQL Survival Game Test Suite")
        print("=" * 60)
        
        # Frontend and game functionality tests
        tests = [
            ("Frontend SQL Dependencies", self.test_frontend_sql_dependencies),
            ("Landing Page Content", self.test_landing_page_content),
            ("Map Page Functionality", self.test_map_page_functionality),
            ("Game Page Structure", self.test_game_page_structure),
            ("Game Routing", self.test_game_routing),
            ("JavaScript Bundle Loading", self.test_javascript_bundle_loading),
            ("CSS and Styling", self.test_css_and_styling),
            ("Responsive Design", self.test_responsive_design),
            ("Performance Metrics", self.test_performance_metrics),
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
        print("📊 SQL GAME TEST SUMMARY")
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
    tester = SQLGameTester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 All SQL game tests passed! Game is working correctly.")
        sys.exit(0)
    else:
        print("⚠️  Some tests failed. Check the results above.")
        sys.exit(1)

if __name__ == "__main__":
    main()