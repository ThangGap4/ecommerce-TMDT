# Migration Plan: Fashion E-commerce → Health Supplements Store

> Document chi tiết plan chuyển đổi từ web bán thời trang sang web bán thực phẩm chức năng

---

## Executive Summary

### Current State
- **Domain**: Fashion e-commerce (Tops, Bottoms, Shoes, Accessories)
- **Product Model**: Có color variants, size variants (S/M/L/XL)
- **Features**: Cart, Checkout, Orders, Reviews, Chatbot, Admin CRUD

### Target State
- **Domain**: Health Supplements store (Vitamins, Protein, Weight Management, etc.)
- **Product Model**: Serving size, ingredients, allergen info, expiry date, certifications
- **New Requirements**: FDA disclaimers, dosage instructions, health warnings

---

## Migration Phases

### Phase 1: Content & Copy Updates 🔴 HIGH PRIORITY

**Objective**: Update all text content to reflect supplement store

#### Tasks:
- [ ] Update page titles, meta descriptions
- [ ] Change navigation labels (Tops → Vitamins, Bottoms → Protein, etc.)
- [ ] Update footer links and about text
- [ ] Change homepage hero banner copy
- [ ] Update email templates (order confirmation, shipping)

**Files Affected**:
- `frontend/src/i18n/en.json`, `vi.json`
- `frontend/src/components/shared/Header.tsx`
- `frontend/src/components/shared/Footer.tsx`
- `frontend/src/pages/home/HomePage.tsx`

---

### Phase 2: Database Schema Migration 🔴 HIGH PRIORITY

**Objective**: Add supplement-specific fields to Product model

#### New Fields Required:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `serving_size` | VARCHAR(100) | Serving size info | "2 capsules", "1 scoop (30g)" |
| `servings_per_container` | INTEGER | Number of servings | 30, 60, 90 |
| `ingredients` | TEXT | Full ingredient list | "Whey Protein Isolate, Natural Flavors, Stevia" |
| `allergen_info` | TEXT | Allergen warnings | "Contains: Milk, Soy" |
| `usage_instructions` | TEXT | How to use | "Take 2 capsules daily with water" |
| `warnings` | TEXT | Health warnings | "Consult physician if pregnant" |
| `expiry_date` | DATE | Product expiration | "2026-12-31" |
| `manufacturer` | VARCHAR(255) | Manufacturer name | "Nature's Best Co." |
| `country_of_origin` | VARCHAR(100) | Manufacturing country | "USA", "Vietnam" |
| `certification` | VARCHAR(255) | Certifications | "FDA, GMP, NSF Certified" |

#### Schema Changes:

```python
# backend/app/models/sqlalchemy/product.py

class Product(Base):
    # ... existing fields ...
    
    # NEW: Supplement-specific fields
    serving_size = Column(String(100), nullable=True)
    servings_per_container = Column(Integer, nullable=True)
    ingredients = Column(Text, nullable=True)
    allergen_info = Column(Text, nullable=True)
    usage_instructions = Column(Text, nullable=True)
    warnings = Column(Text, nullable=True)
    expiry_date = Column(Date, nullable=True)
    manufacturer = Column(String(255), nullable=True)
    country_of_origin = Column(String(100), nullable=True)
    certification = Column(String(255), nullable=True)
```

#### Remove/Modify:
- **DROP**: `product_colors` table (colors not relevant for supplements)
- **KEEP**: `product_sizes` table (reuse for serving quantities: 30/60/90 servings)
- **UPDATE**: `product_type` values from clothing categories to supplement categories

#### Alembic Migration:

```bash
cd backend
alembic revision -m "migrate_to_supplements_schema"
```

**Migration Tasks**:
- [ ] Create alembic migration file
- [ ] Add new columns to product table
- [ ] Drop product_colors table
- [ ] Update existing product_type values
- [ ] Run migration on dev database
- [ ] Test rollback

---

### Phase 3: Category Restructuring 🔴 HIGH PRIORITY

**Old Categories**:
- Tops
- Bottoms
- Shoes
- Accessories

**New Categories**:
- Vitamins & Minerals (Vitamin C, Vitamin D, Multivitamins, Calcium, Magnesium)
- Protein & Fitness (Whey Protein, Plant Protein, BCAAs, Creatine, Pre-Workout)
- Weight Management (Fat Burners, Appetite Suppressants, Meal Replacements)
- Beauty & Skin (Collagen, Biotin, Hyaluronic Acid, Anti-Aging)
- Digestive Health (Probiotics, Fiber, Digestive Enzymes)
- Brain & Focus (Omega-3, Memory Support, Nootropics)
- Immune Support (Elderberry, Zinc, Echinacea, Vitamin C)

#### Tasks:
- [ ] Update category constants in `frontend/src/constants.ts`
- [ ] Update backend category enum if exists
- [ ] Create new category navigation component
- [ ] Update product filters to use new categories

---

### Phase 4: Frontend UI Updates 🔴 HIGH PRIORITY

#### 4.1. Product Detail Page

**File**: `frontend/src/pages/products/ProductDetailPage.tsx`

**Changes Needed**:
- [ ] Remove color picker/selector
- [ ] Update size selector to "Choose Quantity" (30/60/90 servings)
- [ ] Add "Supplement Facts" table section
- [ ] Add "Ingredients" section (expandable list)
- [ ] Add "Usage Instructions" box
- [ ] Add "Warnings" alert box (prominent)
- [ ] Add "Certifications" badges (FDA, GMP, NSF icons)
- [ ] Show expiry date prominently

**Example Layout**:
```tsx
<Box>
  {/* Product Images */}
  <ProductImages />
  
  {/* Product Info */}
  <Typography variant="h4">{product.name}</Typography>
  <Typography variant="subtitle1">{product.manufacturer}</Typography>
  
  {/* Certification Badges */}
  <CertificationBadges certifications={product.certification} />
  
  {/* Price & Add to Cart */}
  <PriceDisplay price={product.price} salePrice={product.sale_price} />
  <QuantitySelector servings={[30, 60, 90]} />
  <AddToCartButton />
  
  {/* Supplement Facts Table */}
  <SupplementFacts 
    servingSize={product.serving_size}
    servingsPerContainer={product.servings_per_container}
    ingredients={product.ingredients}
  />
  
  {/* Usage Instructions */}
  <UsageInstructions text={product.usage_instructions} />
  
  {/* Warnings Alert */}
  <Alert severity="warning">{product.warnings}</Alert>
  
  {/* Reviews Section */}
  <ProductReviews />
</Box>
```

#### 4.2. Product Card Component

**File**: `frontend/src/components/products/ProductCard.tsx`

**Changes Needed**:
- [ ] Remove color dots display
- [ ] Add certification badge (small icon)
- [ ] Add "Servings: 30/60/90" label
- [ ] Update hover actions

#### 4.3. Admin Product Form

**File**: `frontend/src/pages/admin/products/AddProduct.tsx` (to be created)

**Form Fields**:
- [ ] Basic Info: Name, Description, Price, Sale Price
- [ ] Category (dropdown with new categories)
- [ ] Serving Information:
  - Serving Size (text input)
  - Servings per Container (number input)
- [ ] Ingredients (textarea)
- [ ] Allergen Info (textarea)
- [ ] Usage Instructions (rich text editor?)
- [ ] Warnings (textarea)
- [ ] Product Details:
  - Expiry Date (date picker)
  - Manufacturer (text input)
  - Country of Origin (dropdown)
  - Certification (multi-select: FDA, GMP, NSF, etc.)
- [ ] Stock Management (by serving quantity variant)

---

### Phase 5: Search & Filter Updates 🟡 MEDIUM PRIORITY

#### Old Filters:
- Color
- Size (S/M/L/XL)
- Price Range
- Category

#### New Filters:
- Category (new supplement categories)
- Price Range
- Brand/Manufacturer
- Health Goal (Weight Loss, Muscle Gain, Immunity, Energy, Beauty)
- Form (Capsules, Powder, Tablets, Gummies, Liquid)
- Dietary Preference (Vegan, Vegetarian, Gluten-Free, Non-GMO)
- Certification (FDA, GMP, NSF, Organic)

#### Tasks:
- [ ] Update filter component in product listing page
- [ ] Update backend API to accept new filter params
- [ ] Add search suggestions for supplement names

---

### Phase 6: Chatbot System Prompt Update 🟡 MEDIUM PRIORITY

**File**: `backend/app/services/chat_service.py`

**Current System Prompt** (Fashion):
```
You are a helpful shopping assistant for a fashion e-commerce store.
Help users find clothing, shoes, and accessories.
```

**New System Prompt** (Supplements):
```python
SYSTEM_PROMPT = """
You are a knowledgeable health supplement advisor for an online supplement store.

Your role:
- Help customers find the right supplements based on their health goals
- Explain supplement benefits and usage
- Recommend products based on their needs (fitness, weight management, immunity, beauty, etc.)
- Always mention to consult healthcare provider for medical advice

Important:
- DO NOT diagnose medical conditions
- DO NOT make medical claims
- Always include FDA disclaimer: "These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease."
- Only recommend products that exist in our database
- Mention certifications when relevant (GMP, NSF, etc.)

Available product categories: Vitamins, Protein, Weight Management, Beauty, Digestive Health, Brain Support, Immune Support
"""
```

#### Tasks:
- [ ] Update system prompt in `chat_service.py`
- [ ] Update intent detection keywords (fitness → protein, skin → collagen, etc.)
- [ ] Add FDA disclaimer to every product recommendation
- [ ] Test chatbot with supplement queries

---

### Phase 7: Legal & Compliance 🟡 MEDIUM PRIORITY

#### Required Disclaimers:

**Product Pages**:
```
⚠️ These statements have not been evaluated by the Food and Drug Administration.
This product is not intended to diagnose, treat, cure, or prevent any disease.
```

**Checkout Page**:
```
⚠️ Consult your healthcare provider before use, especially if you are pregnant,
nursing, taking medication, or have a medical condition.
```

#### Tasks:
- [ ] Add FDA disclaimer component (reusable)
- [ ] Add to product detail page footer
- [ ] Add to checkout page
- [ ] Update Terms & Conditions
- [ ] Update Privacy Policy (mention health data if collecting)
- [ ] Add "Consult Your Doctor" banner

---

### Phase 8: Sample Data Migration 🟢 LOW PRIORITY

#### Create Sample Supplements:

```python
# Example products to seed database

sample_products = [
    {
        "name": "Premium Whey Protein Isolate",
        "product_type": "Protein & Fitness",
        "price": 45.99,
        "sale_price": 39.99,
        "description": "High-quality whey protein isolate with 25g protein per serving",
        "serving_size": "1 scoop (30g)",
        "servings_per_container": 30,
        "ingredients": "Whey Protein Isolate, Natural Flavors, Stevia, Sunflower Lecithin",
        "allergen_info": "Contains: Milk",
        "usage_instructions": "Mix 1 scoop with 8-10 oz water or milk. Consume post-workout or as needed.",
        "warnings": "Consult physician if pregnant or nursing. Keep out of reach of children.",
        "manufacturer": "NutriFit Labs",
        "country_of_origin": "USA",
        "certification": "GMP, NSF Certified",
        "stock": 150
    },
    {
        "name": "Vitamin D3 5000 IU",
        "product_type": "Vitamins & Minerals",
        "price": 19.99,
        "sale_price": 15.99,
        "description": "High-potency Vitamin D3 for bone and immune health",
        "serving_size": "1 softgel",
        "servings_per_container": 60,
        "ingredients": "Vitamin D3 (as Cholecalciferol), Olive Oil, Gelatin, Glycerin",
        "allergen_info": "None",
        "usage_instructions": "Take 1 softgel daily with a meal, or as directed by healthcare professional.",
        "warnings": "Do not exceed recommended dose. Consult physician if taking medication.",
        "manufacturer": "Pure Health",
        "country_of_origin": "USA",
        "certification": "FDA Registered, GMP",
        "stock": 200
    },
    {
        "name": "Collagen Peptides Powder",
        "product_type": "Beauty & Skin",
        "price": 34.99,
        "sale_price": 29.99,
        "description": "Grass-fed collagen peptides for skin, hair, and joint health",
        "serving_size": "2 scoops (20g)",
        "servings_per_container": 30,
        "ingredients": "Hydrolyzed Collagen Peptides (Bovine)",
        "allergen_info": "None",
        "usage_instructions": "Mix 2 scoops into coffee, smoothies, or water daily.",
        "warnings": "Consult physician if pregnant, nursing, or have medical condition.",
        "manufacturer": "VitaGlow",
        "country_of_origin": "USA",
        "certification": "Grass-Fed, Non-GMO",
        "stock": 100
    }
]
```

#### Tasks:
- [ ] Create seed script `backend/scripts/seed_supplements.py`
- [ ] Clear existing fashion products (or mark inactive)
- [ ] Insert sample supplement data
- [ ] Upload product images for supplements
- [ ] Test product display with new data

---

### Phase 9: Visual Assets & Branding 🟢 LOW PRIORITY

#### Assets Needed:
- [ ] New logo (supplement/health theme)
- [ ] Product images (vitamins, protein powder, pills)
- [ ] Category icons (pill icon, powder icon, etc.)
- [ ] Certification badges (FDA, GMP, NSF logos)
- [ ] Homepage hero image (health/wellness theme)

#### Color Scheme Update:
- **Old**: Fashion colors (pink, black, trendy)
- **New**: Health colors (green, blue, white - clean/medical feel)

#### Tasks:
- [ ] Update `frontend/src/index.css` theme colors
- [ ] Replace logo files in `public/`
- [ ] Find free stock images or create placeholders
- [ ] Update favicon to supplement icon

---

## Implementation Priority

### 🔴 HIGH PRIORITY (Do First)
1. **Database Migration** (Phase 2) - Add new fields, drop colors
2. **Category Restructuring** (Phase 3) - Update navigation
3. **Admin Product Form** (Phase 4.3) - Enable adding new supplements
4. **Product Detail Page** (Phase 4.1) - Show supplement info

### 🟡 MEDIUM PRIORITY (Do Second)
5. **Search & Filters** (Phase 5) - Update filter UI
6. **Chatbot Update** (Phase 6) - Change system prompt
7. **Legal Disclaimers** (Phase 7) - FDA warnings

### 🟢 LOW PRIORITY (Polish)
8. **Sample Data** (Phase 8) - Seed database
9. **Visual Assets** (Phase 9) - Branding update
10. **Content Update** (Phase 1) - Copy changes

---

## Testing Checklist

### After Each Phase:
- [ ] Backend API endpoints return correct data
- [ ] Frontend displays new fields properly
- [ ] Admin can create/edit products with new fields
- [ ] Cart/Checkout flow still works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Database migration reversible

### Final Testing:
- [ ] End-to-end flow: Browse → Add to Cart → Checkout → Order
- [ ] Admin: Create supplement product with all fields
- [ ] Chatbot: Test supplement queries
- [ ] Legal disclaimers visible on all pages
- [ ] Search & filters work with new categories

---

## Rollback Plan

If migration fails:
1. Revert database migration: `alembic downgrade -1`
2. Restore git branch: `git checkout main`
3. Restart services: `docker-compose down && docker-compose up -d`

---

## Notes

- Keep existing Order, Cart, Review, User models unchanged (domain-agnostic)
- Supplement-specific logic only in Product model and UI
- Can run fashion and supplement products simultaneously if needed (just different product_type)
- Consider adding "Product Type" filter (Fashion vs Supplement) for hybrid store

---

## Questions for User

- [ ] Xóa hết product fashion cũ hay giữ lại?
- [ ] Có cần multi-language (EN/VI) cho supplement terms không?
- [ ] Có cần tích hợp thanh toán thật (Stripe) luôn không?
- [ ] Có cần thêm "Prescription Required" flag cho một số sản phẩm không?

---

**Last Updated**: December 10, 2025  
**Status**: Planning Phase  
**Next Step**: Await user confirmation to start Phase 2 (Database Migration)
