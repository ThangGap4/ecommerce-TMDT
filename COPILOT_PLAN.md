# 📋 COPILOT PLAN - E-Commerce Project

> Kế hoạch phát triển website thương mại điện tử theo yêu cầu bài tập đại học

---

## 📌 Phase 0: Bối cảnh cho Copilot

### Mô tả dự án

You are assisting in extending an existing full-stack e-commerce project in this repository.

### 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Material UI, Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **Database** | PostgreSQL |
| **Containerization** | Docker + docker-compose, Nginx reverse proxy |
| **CI/CD** | GitHub Actions + Docker Hub + Watchtower |

### 🎯 Goal

Align the project with a university assignment spec for an e-commerce website (UI, catalog, cart, checkout, auth, admin, security, plus some advanced features).

### ⚙️ Nguyên tắc chung

- ✅ Giữ nguyên kiến trúc hiện có (frontend / backend / nginx)
- ✅ Tái sử dụng style & pattern sẵn có, không tự xây framework mới từ đầu
- ✅ Code đâu thì viết test / ít nhất mock data hoặc demo flow cho chỗ đó
- ✅ Ưu tiên giải pháp đơn giản, dễ giải thích trong báo cáo

---

## 🔍 Phase 1: Hiểu repo & dựng lại môi trường

> **Mục tiêu:** Copilot hỗ trợ đọc cấu trúc, chạy được app, biết API chính nằm ở đâu.

### Tasks for Copilot

#### 1.1. List the main folders and their responsibilities

| Folder | Responsibility |
|--------|----------------|
| \`backend/\` | FastAPI app, models, routers, auth, database config |
| \`frontend/\` | React app (pages, components, API layer, routing, theme) |
| \`nginx/\` & \`docker-compose.yml\` | Deployment setup |

#### 1.2. Search in the backend code for

- [ ] Database connection (SQLAlchemy / async ORM) to PostgreSQL
- [ ] Models for User, Product, Order, Cart (or equivalent)
- [ ] Auth logic (JWT creation/verification, password hashing)

#### 1.3. In the frontend

- [ ] Identify the main router (React Router or similar)
- [ ] Find the pages for: home, product list, product detail, cart, checkout, login/register, admin area

#### 1.4. Generate documentation

Create \`docs/architecture-overview.md\` describing:
- Which endpoints exist (high-level, not full OpenAPI dump)
- How the frontend calls them
- Which tables/entities are currently used in the DB

---

## ✅ Phase 2: Đảm bảo full chức năng bắt buộc

> Dựa theo đề bài, phase này cover toàn bộ **Phần A (7 điểm)**

### 2.1. 🎨 UI Responsive & Trang chủ

#### Tasks for Copilot

**Responsive Layout:**
- [ ] Ensure all main pages use responsive layout
- [ ] Use existing Tailwind / Material UI grid & breakpoints
- [ ] Test on mobile width ~375–414px and desktop width ≥ 1024px

**Home Page:**
- [ ] Hero banner (image or gradient background, title + subtitle)
- [ ] "Featured products" section using existing Product list API
- [ ] Clear CTA button (e.g. "Shop Now" / "Xem sản phẩm") linking to product catalog
- [ ] Create or update Home component and ensure routing sends \`/\` to this page

---

### 2.2. 🔎 Danh mục, lọc & tìm kiếm cơ bản

#### Backend Tasks
- [ ] Extend product list endpoint to accept filters:
  - \`category\`
  - \`min_price\`, \`max_price\`
  - \`brand\` (if not already there)

#### Frontend Tasks
- [ ] Add filter controls on product listing page:
  - Dropdown / select for category
  - Inputs/sliders for price range
  - Optional: brand filter if data supports it
- [ ] Wire controls to query params in API calls
- [ ] Add basic search box by product name/keyword

---

### 2.3. 📦 Quản lý sản phẩm (CRUD, lưu DB quan hệ)

#### Backend Tasks
- [ ] Ensure endpoints exist:
  - \`POST\` - Create product
  - \`GET\` - Read product(s)
  - \`PUT\` - Update product
  - \`DELETE\` - Delete product
- [ ] Product fields: \`id\`, \`name\`, \`description\`, \`price\`, \`image_url\`, \`category\`, \`brand\` (optional), \`stock\`

#### Admin Frontend Tasks
- [ ] Create/refine Admin Products page:
  - Table of products with pagination
  - Form for add / edit
  - Delete button with confirmation
- [ ] Restrict endpoints & pages to admin users only (using \`is_admin\` flag on User)

---

### 2.4. 🛒 Giỏ hàng

#### Backend Tasks
- [ ] Implement/verify Cart model:
  - Associated with a user (or session for guest)
  - Has \`cart_items\` with \`product_id\`, \`quantity\`, \`unit_price\`
- [ ] Endpoints:
  - Add item to cart
  - Remove item from cart
  - Update quantity
  - Get current cart

#### Frontend Tasks
- [ ] Cart page features:
  - Shows list of items
  - Allows item removal & quantity change
  - Displays subtotal / total
- [ ] Persist cart state:
  - Logged-in users → sync with backend
  - Guests → use localStorage until login

---

### 2.5. 💳 Thanh toán & tạo đơn hàng

> ⚠️ Chưa cần tiền thật

#### Order Entity
\`\`\`
Fields: id, user_id, items, total_amount, status, timestamps
Status: pending | processing | shipped | completed | cancelled
\`\`\`

#### Checkout Flow
- [ ] From cart → navigate to checkout page
- [ ] Show shipping info form (name, address, phone, email)
- [ ] Display order summary
- [ ] On submit → create order record in DB

#### Payment Integration (Stripe Test Mode)
- [ ] Backend: create Stripe payment intent endpoint
- [ ] Frontend: simple Stripe checkout integration using test keys
- [ ] Log payment status & update \`order.status\` accordingly

---

### 2.6. 👤 Tài khoản khách hàng

#### Security Requirements
- [ ] Password hashing with bcrypt (or passlib w/ bcrypt)
- [ ] JWT for access tokens

#### Auth Endpoints
- [ ] \`POST /auth/register\`
- [ ] \`POST /auth/login\`
- [ ] \`POST /auth/forgot-password\` (accept email)
- [ ] \`POST /auth/reset-password\` (token + new password)

#### Email Verification
- [ ] Generate verification token on register
- [ ] Endpoint to "confirm email" by token
- [ ] For demo: use console log / mock email sender / Mailhog in Docker

#### Frontend
- [ ] Pages/forms for register, login, forgot password, reset password
- [ ] Basic validation & error display

---

### 2.7. 📋 Quản lý đơn hàng cho Admin

#### Backend Endpoints
- [ ] List all orders (with filters by status)
- [ ] Get order detail
- [ ] Update order status

#### Admin Frontend
- [ ] "Admin Orders" page:
  - Table with order ID, user, total, status, created date
  - Detail view with list of items
  - Dropdown/button to change status (processing, shipped, completed, etc.)

---

### 2.8. 🔒 Bảo mật cơ bản

#### Backend
- [ ] CORS configured properly: frontend origin only in dev, env-driven in prod
- [ ] Add security headers middleware (equivalent to Helmet)

#### HTTPS
- [ ] For local dev: document how to run behind Nginx with self-signed cert
- [ ] Create \`docs/security-notes.md\` explaining HTTPS setup

---

## ⭐ Phase 3: Chức năng mở rộng (cộng điểm)

### 3.1. ⭐ Đánh giá & bình luận sản phẩm

#### Backend
- [ ] Add Review model: \`id\`, \`user_id\`, \`product_id\`, \`rating\` (1–5), \`comment\`, \`timestamps\`
- [ ] Endpoints:
  - Add review (authenticated users only)
  - List reviews for a product

#### Frontend
- [ ] Product detail page:
  - Show average rating + count
  - Show list of reviews
  - Form to add review (if user logged in)

---

### 3.2. 🎫 Mã giảm giá / khuyến mãi

#### Backend
- [ ] Coupon model: \`code\`, \`discount_type\` (percent/fixed), \`value\`, \`valid_from\`, \`valid_to\`, \`usage_limit\`
- [ ] Endpoint: validate coupon & calculate discounted total

#### Frontend
- [ ] Checkout page:
  - Input field for coupon code
  - Apply button → call API → update displayed total
- [ ] Ensure coupon logic is applied when creating order

---

### 3.3. 🔍 Tìm kiếm nâng cao

#### Backend
- [ ] Full text search by name / description (ILIKE or full-text search)
- [ ] Combined filters: brand, category, price range

#### Frontend
- [ ] "Advanced filters" section (collapsible)
- [ ] Combine filters into one query to backend

---

### 3.4. 📊 Phân tích & báo cáo (Dashboard)

#### Backend Endpoints
- [ ] Total revenue by day / month
- [ ] Number of orders
- [ ] Number of customers
- [ ] Top-selling products (by quantity)

#### Admin Frontend
- [ ] "Analytics" or "Dashboard" page
- [ ] Charts or summary cards

---

## �� Phase 4: Chức năng tùy chọn

### 4.1. 💬 Chatbot / Live chat đơn giản

#### Options
- [ ] Embed third-party live-chat widget script, **OR**
- [ ] Build minimal "chat" component that sends messages to dummy backend endpoint

#### UI
- [ ] Chat button fixed at bottom-right of the site

---

### 4.2. 🌐 Hỗ trợ đa ngôn ngữ / đa tiền tệ

#### Language (i18n)
- [ ] Add language switcher (EN / VI)
- [ ] Use react-i18next or custom translation JSON files
- [ ] Wrap all major text strings through translation function

#### Currency
- [ ] Let user choose currency (VND / USD)
- [ ] Store prices in base currency (USD) in DB
- [ ] Apply fixed conversion rate for display only
- [ ] Show symbol and formatted number correctly

---

## 🐳 Phase 5: Deploy & Tài liệu

### Docker & Nginx
- [ ] Check \`docker-compose.yml\`, nginx configs
- [ ] Ensure frontend + backend + DB services all defined & working
- [ ] Verify ports, environment variables, DB connection strings

### Documentation
- [ ] Create \`docs/deployment-guide.md\`:
  - How to run in dev: local, docker-compose
  - How CI/CD flow works with GitHub Actions + Docker Hub + Watchtower

### README Update
- [ ] List all implemented features:
  - **Core features**
  - **Bonus features**
- [ ] Note which parts match the assignment rubric
