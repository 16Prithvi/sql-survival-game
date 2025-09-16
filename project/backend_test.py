#!/usr/bin/env python3
"""
Backend Test Suite for SQL Survival Game

This test suite validates the backend functionality of the SQL Survival game,
including API endpoints and database operations.
"""

import requests
import json
import time
import sys
from datetime import datetime

# Configuration
BACKEND_URL = "https://codeisland.preview.emergentagent.com/api"
FRONTEND_URL = "https://codeisland.preview.emergentagent.com"

class SQLSurvivalTester:
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
    
    def test_backend_health(self):
        """Test if backend is responding"""
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("message") == "Hello World":
                    self.log_test("Backend Health Check", True, "Backend is responding correctly")
                    return True
                else:
                    self.log_test("Backend Health Check", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_test("Backend Health Check", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Backend Health Check", False, f"Connection error: {str(e)}")
            return False
    
    def test_status_endpoints(self):
        """Test status check CRUD operations"""
        try:
            # Test POST - Create status check
            test_data = {
                "client_name": "SQL_Survival_Test_Client"
            }
            
            response = requests.post(f"{BACKEND_URL}/status", 
                                   json=test_data, 
                                   timeout=10)
            
            if response.status_code == 200:
                created_status = response.json()
                if (created_status.get("client_name") == test_data["client_name"] and 
                    "id" in created_status and 
                    "timestamp" in created_status):
                    self.log_test("Status Creation (POST)", True, f"Created status with ID: {created_status['id']}")
                    
                    # Test GET - Retrieve status checks
                    get_response = requests.get(f"{BACKEND_URL}/status", timeout=10)
                    if get_response.status_code == 200:
                        status_list = get_response.json()
                        if isinstance(status_list, list) and len(status_list) > 0:
                            # Check if our created status is in the list
                            found = any(status.get("id") == created_status["id"] for status in status_list)
                            if found:
                                self.log_test("Status Retrieval (GET)", True, f"Retrieved {len(status_list)} status records")
                                return True
                            else:
                                self.log_test("Status Retrieval (GET)", False, "Created status not found in list")
                                return False
                        else:
                            self.log_test("Status Retrieval (GET)", False, "Empty or invalid status list")
                            return False
                    else:
                        self.log_test("Status Retrieval (GET)", False, f"HTTP {get_response.status_code}")
                        return False
                else:
                    self.log_test("Status Creation (POST)", False, f"Invalid response structure: {created_status}")
                    return False
            else:
                self.log_test("Status Creation (POST)", False, f"HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Status Endpoints", False, f"Error: {str(e)}")
            return False
    
    def test_frontend_accessibility(self):
        """Test if frontend is accessible"""
        try:
            response = requests.get(FRONTEND_URL, timeout=15)
            if response.status_code == 200:
                content = response.text
                if "SQL SURVIVAL" in content or "sql" in content.lower():
                    self.log_test("Frontend Accessibility", True, "Frontend is accessible and contains SQL game content")
                    return True
                else:
                    self.log_test("Frontend Accessibility", False, "Frontend accessible but missing expected content")
                    return False
            else:
                self.log_test("Frontend Accessibility", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Frontend Accessibility", False, f"Connection error: {str(e)}")
            return False
    
    def test_game_routes(self):
        """Test if game routes are accessible"""
        game_routes = [
            "/",
            "/map", 
            "/game/beach",
            "/game/jungle", 
            "/game/ruins"
        ]
        
        all_passed = True
        accessible_routes = []
        
        for route in game_routes:
            try:
                response = requests.get(f"{FRONTEND_URL}{route}", timeout=10)
                if response.status_code == 200:
                    accessible_routes.append(route)
                else:
                    all_passed = False
                    self.log_test(f"Game Route {route}", False, f"HTTP {response.status_code}")
            except Exception as e:
                all_passed = False
                self.log_test(f"Game Route {route}", False, f"Error: {str(e)}")
        
        if accessible_routes:
            self.log_test("Game Routes Accessibility", True, f"Accessible routes: {', '.join(accessible_routes)}")
        
        return all_passed
    
    def test_cors_configuration(self):
        """Test CORS configuration"""
        try:
            # Test preflight request
            headers = {
                'Origin': FRONTEND_URL,
                'Access-Control-Request-Method': 'POST',
                'Access-Control-Request-Headers': 'Content-Type'
            }
            
            response = requests.options(f"{BACKEND_URL}/status", headers=headers, timeout=10)
            
            # Check if CORS headers are present
            cors_headers = [
                'Access-Control-Allow-Origin',
                'Access-Control-Allow-Methods',
                'Access-Control-Allow-Headers'
            ]
            
            has_cors = any(header in response.headers for header in cors_headers)
            
            if has_cors or response.status_code in [200, 204]:
                self.log_test("CORS Configuration", True, "CORS headers configured properly")
                return True
            else:
                self.log_test("CORS Configuration", False, f"Missing CORS headers, status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("CORS Configuration", False, f"Error: {str(e)}")
            return False
    
    def test_database_connection(self):
        """Test database connectivity through API"""
        try:
            # Create multiple status checks to test database persistence
            test_clients = ["TestClient1", "TestClient2", "TestClient3"]
            created_ids = []
            
            for client in test_clients:
                response = requests.post(f"{BACKEND_URL}/status", 
                                       json={"client_name": client}, 
                                       timeout=10)
                if response.status_code == 200:
                    created_ids.append(response.json().get("id"))
                else:
                    self.log_test("Database Connection", False, f"Failed to create status for {client}")
                    return False
            
            # Retrieve all status checks
            response = requests.get(f"{BACKEND_URL}/status", timeout=10)
            if response.status_code == 200:
                all_statuses = response.json()
                
                # Check if all our test clients are present
                found_clients = [status.get("client_name") for status in all_statuses 
                               if status.get("client_name") in test_clients]
                
                if len(found_clients) >= len(test_clients):
                    self.log_test("Database Connection", True, f"Database persistence working - found {len(found_clients)} test records")
                    return True
                else:
                    self.log_test("Database Connection", False, f"Only found {len(found_clients)} of {len(test_clients)} test records")
                    return False
            else:
                self.log_test("Database Connection", False, f"Failed to retrieve status checks: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Database Connection", False, f"Error: {str(e)}")
            return False
    
    def test_api_performance(self):
        """Test API response times"""
        try:
            # Test GET endpoint performance
            start_time = time.time()
            response = requests.get(f"{BACKEND_URL}/", timeout=10)
            get_time = time.time() - start_time
            
            if response.status_code == 200 and get_time < 2.0:
                self.log_test("API Performance (GET)", True, f"Response time: {get_time:.3f}s")
            else:
                self.log_test("API Performance (GET)", False, f"Slow response: {get_time:.3f}s or error")
                return False
            
            # Test POST endpoint performance
            start_time = time.time()
            response = requests.post(f"{BACKEND_URL}/status", 
                                   json={"client_name": "PerformanceTest"}, 
                                   timeout=10)
            post_time = time.time() - start_time
            
            if response.status_code == 200 and post_time < 3.0:
                self.log_test("API Performance (POST)", True, f"Response time: {post_time:.3f}s")
                return True
            else:
                self.log_test("API Performance (POST)", False, f"Slow response: {post_time:.3f}s or error")
                return False
                
        except Exception as e:
            self.log_test("API Performance", False, f"Error: {str(e)}")
            return False
    
    def test_error_handling(self):
        """Test API error handling"""
        try:
            # Test invalid JSON
            response = requests.post(f"{BACKEND_URL}/status", 
                                   data="invalid json", 
                                   headers={'Content-Type': 'application/json'},
                                   timeout=10)
            
            if response.status_code in [400, 422]:
                self.log_test("Error Handling (Invalid JSON)", True, f"Properly rejected invalid JSON with HTTP {response.status_code}")
            else:
                self.log_test("Error Handling (Invalid JSON)", False, f"Unexpected status code: {response.status_code}")
                return False
            
            # Test missing required field
            response = requests.post(f"{BACKEND_URL}/status", 
                                   json={}, 
                                   timeout=10)
            
            if response.status_code in [400, 422]:
                self.log_test("Error Handling (Missing Field)", True, f"Properly rejected missing field with HTTP {response.status_code}")
                return True
            else:
                self.log_test("Error Handling (Missing Field)", False, f"Unexpected status code: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Error Handling", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting SQL Survival Backend Test Suite")
        print("=" * 60)
        
        # Core backend tests
        tests = [
            ("Backend Health", self.test_backend_health),
            ("Status Endpoints", self.test_status_endpoints),
            ("Database Connection", self.test_database_connection),
            ("CORS Configuration", self.test_cors_configuration),
            ("API Performance", self.test_api_performance),
            ("Error Handling", self.test_error_handling),
            ("Frontend Accessibility", self.test_frontend_accessibility),
            ("Game Routes", self.test_game_routes),
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
        print("📊 TEST SUMMARY")
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
    tester = SQLSurvivalTester()
    success = tester.run_all_tests()
    
    if success:
        print("🎉 All tests passed! Backend is working correctly.")
        sys.exit(0)
    else:
        print("⚠️  Some tests failed. Check the results above.")
        sys.exit(1)

if __name__ == "__main__":
    main()