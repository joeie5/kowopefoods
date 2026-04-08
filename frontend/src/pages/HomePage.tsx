import { Helmet } from 'react-helmet-async'
import HeroSection from '../components/home/HeroSection'
import CategoryShowcase from '../components/home/CategoryShowcase'
import FeaturedProducts from '../components/home/FeaturedProducts'
import ProductRow from '../components/home/ProductRow'
import PromoBanner from '../components/home/PromoBanner'
import WhyUsSection from '../components/home/WhyUsSection'
import AboutTeaser from '../components/home/AboutTeaser'
import Newsletter from '../components/home/Newsletter'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Kowope Foods | Premium African Groceries, Fashion & Beauty for the Diaspora</title>
        <meta name="description" content="Sourcing the finest African groceries, authentic fabrics, and beauty products for the diaspora in the UK and Europe. Fast delivery and 100% authentic." />
      </Helmet>

      <HeroSection />
      <CategoryShowcase />
      
      <div className="w-full px-4 md:px-8 pb-16">
        <FeaturedProducts />
        <ProductRow title="Flours & Grains" categoryId="flours-grains" limit={6} />
        <ProductRow title="Spices & Seasonings" categoryId="spices-seasonings" limit={6} />
      </div>

      <PromoBanner />
      <WhyUsSection />
      <AboutTeaser />
      <Newsletter />
    </>
  )
}

export default HomePage
