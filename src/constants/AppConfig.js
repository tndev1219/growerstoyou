/**
 * App Constants
*/

export default {
  AppLogo: require('../assets/images/header-logo.png'),         // App logo
  rtlLayout: false,                                             // RTL Layout
  adminLayout: false,                                            // Admin Layout
  navCollapsed: false,                                          // Sidebar Nav Layout

  // Default locale
  locale: {
      locale: 'en',
      name: 'English',
      icon: 'en',
  },
  // Footer about description
  AboutUs: 'Organic food at an instance!',
  // Copyright text
  CopyrightText: '© 2019 growerstoyou.com',
  //  DB_URL: 'http://192.168.1.187:5000/',
  DB_URL: 'http://166.88.19.232:5000/',
  BASE_URL: 'http://192.168.1.192:4000/',
  //  BASE_URL: 'http://166.88.19.232:4000/',
  S3_BUCKET: 'https://growertoyou-dev.s3.amazonaws.com/public/',
  STRIPE_PUBLIC_KEY: 'pk_test_YuHCqMMJ37B4dkhPW6C5fyC800TlyMXazk'
}
