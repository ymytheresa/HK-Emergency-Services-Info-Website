# Template System Guide

This project has been designed as a flexible template system that can be easily adapted for different types of directory/guide websites. Whether you want to create a restaurant guide, shopping directory, service locator, or any other location-based information site, this template provides the foundation.

## Quick Start

1. Copy `assets/site-config.js` and modify it for your domain
2. Update `assets/data.js` with your content
3. Customize `assets/lang.js` with your terminology
4. That's it! The site will automatically adapt to your configuration

## Configuration Structure

### 1. Site Configuration (`site-config.js`)

The heart of the template system. Key sections:

```javascript
// Define your content type
itemType: {
    singular: 'restaurant',    // Change from 'hospital'
    plural: 'restaurants',     // Change from 'hospitals'
    singular_zh: '餐廳',
    plural_zh: '餐廳'
}

// Toggle features on/off
features: {
    locationFinder: true,      // Keep for any location-based service
    priceComparison: true,     // Useful for most domains
    waitingTimes: false,       // Turn off for non-medical sites
    emergencyBanner: false,    // Only for emergency services
    ratings: true              // Add new features as needed
}
```

### 2. Data Structure

The system uses a flexible data structure. Required fields:
- `id`: Unique identifier
- `name_en` & `name_zh`: Bilingual names
- `lat` & `lon`: Coordinates for mapping
- Category fields (customizable)

Add any optional fields your domain needs:
- Restaurants: `cuisine`, `priceRange`, `rating`, `openingHours`
- Shopping: `mall`, `floor`, `brands`, `currentSales`
- Services: `availability`, `certifications`, `specialties`

### 3. Filter Categories

Define your own filter categories:

```javascript
filterCategories: {
    cuisine: {  // Instead of 'sector'
        field: 'cuisine',
        options: ['chinese', 'western', 'japanese'],
        labels: {
            zh: { chinese: '中菜', western: '西餐', japanese: '日本菜' },
            en: { chinese: 'Chinese', western: 'Western', japanese: 'Japanese' }
        }
    }
}
```

## Example Use Cases

### Restaurant Guide
- Features: ratings, opening hours, cuisine filters, reservation apps
- Disable: waiting times, emergency banners
- Add: photo galleries, menu links, delivery options

### Shopping Directory
- Features: store categories, price levels, current sales, floor maps
- Disable: waiting times, specialist filtering
- Add: brand lists, payment methods, membership programs

### Service Directory
- Features: service categories, availability, pricing tiers
- Disable: emergency features
- Add: booking systems, reviews, certifications

### Real Estate Listings
- Features: property types, price ranges, amenities
- Disable: most medical features
- Add: virtual tours, mortgage calculators, agent contacts

## Step-by-Step Customization

1. **Choose Your Domain**
   - Decide what type of directory you're creating
   - Look at the examples in `/examples/` folder

2. **Configure Features**
   - Copy `site-config.js`
   - Update `itemType` with your terminology
   - Toggle features on/off
   - Define your filter categories

3. **Prepare Your Data**
   - Structure your data following the pattern in `data.js`
   - Include all required fields
   - Add domain-specific optional fields

4. **Update Language Content**
   - Modify `lang.js` with your terminology
   - Keep the same key structure
   - Add new keys for new features

5. **Customize Styling** (Optional)
   - Update colors in `branding` section
   - Modify CSS classes if needed
   - Add custom icons

## Advanced Customization

### Adding New Features

To add a completely new feature:

1. Add feature toggle in `site-config.js`
2. Add UI components conditionally:
   ```javascript
   if (siteConfig.features.yourNewFeature) {
       // Render your feature
   }
   ```
3. Add language keys for the feature
4. Style as needed

### API Integrations

The template supports various API integrations:
- Geocoding services
- Real-time data feeds
- Rating/review systems
- Booking/reservation APIs

Configure in the `api` section of site-config.js

### Multiple Domains

You can even run multiple sites from the same codebase:
1. Create multiple config files
2. Load the appropriate config based on domain/subdomain
3. Share the core code across all sites

## Best Practices

1. **Start Simple**: Get basic functionality working before adding complex features
2. **Test Incrementally**: Test each configuration change
3. **Keep Data Clean**: Ensure your data follows the defined structure
4. **Maintain Bilingual Support**: Always provide both language versions
5. **Mobile First**: The template is mobile-responsive, test on mobile devices

## Need Help?

- Check `/examples/` for more configuration examples
- Review the original emergency services implementation
- The codebase is well-commented for guidance

## Future Enhancements

This template system can grow to include:
- User accounts and favorites
- Search functionality
- Advanced filtering
- Data management interface
- Multi-city support
- API endpoints for mobile apps

The architecture is designed to be extensible while maintaining simplicity for basic use cases.