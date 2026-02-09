import requests
import sys
import json
from datetime import datetime

class TechTribeAPITester:
    def __init__(self, base_url="https://premium-web-build-1.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}{endpoint}"
        request_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            request_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            request_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=request_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=request_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=request_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=request_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                return True, response.json() if response.content else {}
            else:
                self.failed_tests.append({
                    'name': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200] if response.text else '',
                    'endpoint': endpoint
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.text:
                    print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append({
                'name': name,
                'error': str(e),
                'endpoint': endpoint
            })
            return False, {}

    def test_catalogue_endpoints(self):
        """Test catalogue API endpoints"""
        print("\n=== TESTING CATALOGUE ENDPOINTS ===")
        
        # Get all catalogue items
        success, catalogue = self.run_test(
            "Get All Catalogue Items",
            "GET",
            "/catalogue",
            200
        )
        
        if not success:
            return False
            
        print(f"   Found {len(catalogue)} catalogue items")
        
        # Test category filtering 
        success, _ = self.run_test(
            "Filter by Biznes Category",
            "GET", 
            "/catalogue?category=Biznes",
            200
        )
        
        # Test featured filtering
        success, _ = self.run_test(
            "Get Featured Items",
            "GET",
            "/catalogue?featured=true", 
            200
        )

        # Test getting specific item
        if catalogue and len(catalogue) > 0:
            item_id = catalogue[0]['id']
            success, item = self.run_test(
                "Get Catalogue Item by ID",
                "GET",
                f"/catalogue/{item_id}",
                200
            )
            
            if success and item:
                print(f"   Item details: {item.get('title', 'N/A')} - {item.get('price', 0)} {item.get('currency', 'AZN')}")
        
        return True

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n=== TESTING AUTH ENDPOINTS ===")
        
        # Test login with admin credentials
        login_data = {
            "email": "admin@techtribe.az",
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login", 
            "POST",
            "/auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            print(f"   ✅ Login successful, token received")
            print(f"   User: {response.get('user', {}).get('name', 'N/A')}")
            
            # Test get current user
            success, user = self.run_test(
                "Get Current User",
                "GET", 
                "/auth/me",
                200
            )
            
            if success:
                print(f"   User details: {user.get('name', 'N/A')} ({user.get('email', 'N/A')})")
            
            return True
        else:
            print(f"   ❌ Login failed - no token received")
            return False

    def test_contact_endpoint(self):
        """Test contact form submission"""
        print("\n=== TESTING CONTACT ENDPOINT ===")
        
        contact_data = {
            "name": "Test User",
            "email": "test@example.com", 
            "phone": "+994501234567",
            "subject": "Test Message",
            "message": "Bu test mesajıdır. TechTribe haqqında məlumat almaq istəyirəm."
        }
        
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "/contact", 
            200,
            data=contact_data
        )
        
        if success:
            print(f"   Message ID: {response.get('id', 'N/A')}")
            print(f"   Email sent: {response.get('email_sent', False)}")
        
        return success

    def test_chat_endpoints(self):
        """Test chat functionality"""
        print("\n=== TESTING CHAT ENDPOINTS ===")
        
        # Test sending chat message
        session_id = f"test_session_{int(datetime.now().timestamp())}"
        chat_data = {
            "session_id": session_id,
            "message": "Salam! TechTribe haqqında məlumat verə bilərsiniz?", 
            "user_name": "Test User"
        }
        
        print(f"   Using session ID: {session_id}")
        success, response = self.run_test(
            "Send Chat Message",
            "POST",
            "/chat/send",
            200,
            data=chat_data
        )
        
        if success:
            print(f"   AI Reply: {response.get('reply', 'N/A')[:100]}...")
            conversation_id = response.get('conversation_id')
            
            # Test getting chat history
            success, history = self.run_test(
                "Get Chat History",
                "GET",
                f"/chat/history/{session_id}",
                200
            )
            
            if success:
                messages = history.get('messages', [])
                print(f"   Chat history has {len(messages)} messages")
                
        return success

    def test_admin_endpoints(self):
        """Test admin-only endpoints (requires authentication)"""
        print("\n=== TESTING ADMIN ENDPOINTS ===")
        
        if not self.token:
            print("❌ No auth token available, skipping admin tests")
            return False
            
        # Test dashboard stats
        success, stats = self.run_test(
            "Get Dashboard Stats",
            "GET",
            "/dashboard/stats", 
            200
        )
        
        if success:
            print(f"   Total products: {stats.get('total_products', 0)}")
            print(f"   Total messages: {stats.get('total_messages', 0)}")
            print(f"   Unread messages: {stats.get('unread_messages', 0)}") 
            print(f"   Total chats: {stats.get('total_chats', 0)}")
            
        # Test get messages (admin only)
        success, messages = self.run_test(
            "Get Contact Messages",
            "GET", 
            "/messages",
            200
        )
        
        if success:
            print(f"   Found {len(messages)} contact messages")
            
        # Test get conversations (admin only) 
        success, conversations = self.run_test(
            "Get Chat Conversations",
            "GET",
            "/chat/conversations",
            200
        )
        
        if success:
            print(f"   Found {len(conversations)} chat conversations")
            
        return True

    def test_catalogue_crud(self):
        """Test catalogue CRUD operations (admin only)"""
        print("\n=== TESTING CATALOGUE CRUD ===")
        
        if not self.token:
            print("❌ No auth token available, skipping CRUD tests")
            return False
            
        # Create new product
        new_product = {
            "title": "Test Məhsul",
            "description": "Bu test məhsuludur.",
            "short_description": "Test məhsulu",
            "features": ["Test xüsusiyyəti 1", "Test xüsusiyyəti 2"],
            "technologies": ["React", "FastAPI"], 
            "price": 199,
            "currency": "AZN",
            "images": ["https://example.com/test.jpg"],
            "category": "Test",
            "is_featured": False
        }
        
        success, created = self.run_test(
            "Create New Product",
            "POST",
            "/catalogue",
            201,
            data=new_product
        )
        
        if success and created:
            product_id = created.get('id')
            print(f"   Created product with ID: {product_id}")
            
            # Update the product
            update_data = {
                "price": 299,
                "is_featured": True
            }
            
            success, updated = self.run_test(
                "Update Product",
                "PUT", 
                f"/catalogue/{product_id}",
                200,
                data=update_data
            )
            
            if success:
                print(f"   Updated price to: {updated.get('price', 'N/A')} AZN")
                
            # Delete the test product
            success, _ = self.run_test(
                "Delete Test Product",
                "DELETE",
                f"/catalogue/{product_id}",
                200
            )
            
            if success:
                print(f"   ✅ Test product deleted successfully")
                
        return success

    def test_ai_search_v3(self):
        """Test new V3 AI-powered catalogue search"""
        print("\n=== TESTING V3 AI SEARCH ===")
        
        # Test AI search with 'premium' query
        success, results = self.run_test(
            "AI Search - Premium",
            "GET",
            "/catalogue/search/ai?q=premium",
            200
        )
        
        if success:
            print(f"   Premium search returned {len(results)} results")
        
        # Test AI search with 'ucuz' (cheap) query  
        success, results = self.run_test(
            "AI Search - Ucuz",
            "GET",
            "/catalogue/search/ai?q=ucuz",
            200
        )
        
        if success:
            print(f"   Ucuz search returned {len(results)} results")
            
        # Test AI search with 'react' query
        success, results = self.run_test(
            "AI Search - React",
            "GET", 
            "/catalogue/search/ai?q=react",
            200
        )
        
        if success:
            print(f"   React search returned {len(results)} results")
            
        # Test empty search
        success, results = self.run_test(
            "AI Search - Empty Query",
            "GET",
            "/catalogue/search/ai?q=",
            200
        )
        
        if success:
            print(f"   Empty search returned {len(results)} results (should return all)")
            
        return success

    def test_user_management_v3(self):
        """Test new V3 user management features"""
        print("\n=== TESTING V3 USER MANAGEMENT ===")
        
        if not self.token:
            print("❌ No auth token available, skipping user management tests")
            return False
            
        # Get all users
        success, users = self.run_test(
            "Get All Users",
            "GET",
            "/users",
            200
        )
        
        if success:
            print(f"   Found {len(users)} users in system")
            
            if len(users) > 0:
                # Find a user that's not the current admin to test with
                test_user = None
                for user in users:
                    if user.get('email') != 'admin@techtribe.az':
                        test_user = user
                        break
                        
                if test_user:
                    user_id = test_user['id']
                    print(f"   Testing with user: {test_user.get('name', 'N/A')} ({test_user.get('email', 'N/A')})")
                    
                    # Test block/unblock user
                    success, response = self.run_test(
                        "Block/Unblock User",
                        "PUT",
                        f"/users/{user_id}/block",
                        200
                    )
                    
                    if success:
                        is_blocked = response.get('is_blocked', False)
                        print(f"   User block status changed to: {is_blocked}")
                        
                    # Test change user role
                    success, response = self.run_test(
                        "Change User Role", 
                        "PUT",
                        f"/users/{user_id}/role",
                        200
                    )
                    
                    if success:
                        new_role = response.get('role', 'N/A')
                        print(f"   User role changed to: {new_role}")
                        
                else:
                    print("   ⚠️  No other users found to test user management features")
            else:
                print("   ⚠️  No users found in system")
                
        return success

    def test_admin_secret_v3(self):
        """Test new V3 admin secret registration feature"""
        print("\n=== TESTING V3 ADMIN SECRET REGISTRATION ===")
        
        # Test registration with wrong admin secret
        wrong_secret_data = {
            "name": "Test User Wrong",
            "email": f"test_wrong_{int(datetime.now().timestamp())}@example.com",
            "password": "testpass123",
            "admin_secret": "wrong_secret"
        }
        
        success, response = self.run_test(
            "Register with Wrong Admin Secret",
            "POST",
            "/auth/register", 
            403,  # Should return 403 Forbidden
            data=wrong_secret_data
        )
        
        if success:
            print("   ✅ Correctly rejected wrong admin secret")
        else:
            print("   ❌ Should have rejected wrong admin secret with 403")
            
        # Test registration with correct admin secret
        correct_secret_data = {
            "name": "Test User Correct",
            "email": f"test_correct_{int(datetime.now().timestamp())}@example.com", 
            "password": "testpass123",
            "admin_secret": "elituqay"
        }
        
        success, response = self.run_test(
            "Register with Correct Admin Secret",
            "POST",
            "/auth/register",
            200,  # Should succeed
            data=correct_secret_data
        )
        
        if success and 'token' in response:
            print("   ✅ Successfully registered with correct admin secret")
            print(f"   New user: {response.get('user', {}).get('name', 'N/A')}")
            
            # Clean up - delete the test user
            new_user_id = response.get('user', {}).get('id')
            if new_user_id and self.token:
                cleanup_success, _ = self.run_test(
                    "Clean up Test User",
                    "DELETE",
                    f"/users/{new_user_id}",
                    200
                )
                if cleanup_success:
                    print("   🧹 Test user cleaned up successfully")
        else:
            print("   ❌ Registration with correct secret failed")
            
        return success

def main():
    print("🚀 Starting TechTribe API Tests...")
    print("=" * 50)
    
    tester = TechTribeAPITester()
    
    # Test suite - order matters for authentication 
    test_results = {}
    
    # 1. Test catalogue (no auth needed)
    test_results['catalogue'] = tester.test_catalogue_endpoints()
    
    # 2. Test V3 AI search (no auth needed)
    test_results['ai_search'] = tester.test_ai_search_v3()
    
    # 3. Test contact form (no auth needed)
    test_results['contact'] = tester.test_contact_endpoint()
    
    # 4. Test auth (sets up token for subsequent tests)
    test_results['auth'] = tester.test_auth_endpoints()
    
    # 5. Test V3 admin secret registration (no auth needed initially)
    test_results['admin_secret'] = tester.test_admin_secret_v3()
    
    # 6. Test admin endpoints (requires auth)
    if test_results['auth']:
        test_results['admin'] = tester.test_admin_endpoints()
        test_results['crud'] = tester.test_catalogue_crud()
        test_results['user_mgmt'] = tester.test_user_management_v3()
    else:
        print("\n⚠️  Skipping admin tests due to auth failure")
        test_results['admin'] = False
        test_results['crud'] = False
        test_results['user_mgmt'] = False
        
    # 7. Test chat (no auth needed, but slow - AI responses) - Skip for now to speed up testing
    # test_results['chat'] = tester.test_chat_endpoints()
    
    # Print final summary
    print("\n" + "=" * 50)
    print(f"📊 FINAL RESULTS")
    print("=" * 50)
    print(f"✅ Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"❌ Tests failed: {tester.tests_run - tester.tests_passed}/{tester.tests_run}")
    
    if tester.failed_tests:
        print(f"\n❌ FAILED TESTS:")
        for i, test in enumerate(tester.failed_tests, 1):
            print(f"{i}. {test['name']} - {test.get('endpoint', 'N/A')}")
            if 'expected' in test:
                print(f"   Expected: {test['expected']}, Got: {test['actual']}")
            if 'error' in test:
                print(f"   Error: {test['error']}")
            if 'response' in test and test['response']:
                print(f"   Response: {test['response']}")
    
    # Feature summary
    print(f"\n🎯 FEATURE TEST RESULTS:")
    for feature, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {feature.upper()}: {status}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n📈 Overall Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())