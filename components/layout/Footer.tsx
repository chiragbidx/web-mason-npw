import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-bold text-rose-600 mb-4 inline-block">
              PandaStay
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Find your perfect stay with PandaStay. From cozy cottages to luxury villas, we connect you with unique homes and experiences around the world.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons (SVG) */}
              <a href="#" className="text-gray-400 hover:text-rose-600 transition-colors" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-600 transition-colors" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-rose-600 transition-colors" aria-label="Instagram">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 014.18 3.388c.636-.247 1.363-.416 2.427-.465C7.667 2.012 8.021 2 10.45 2h1.865zm0 2.16h-1.865c-2.36 0-2.65.01-3.663.056-.937.043-1.446.195-1.785.327-.45.175-.77.383-1.106.719-.336.336-.544.656-.72 1.106-.132.339-.284.848-.327 1.785-.046 1.013-.056 1.303-.056 3.663v1.865c0 2.36.01 2.65.056 3.663.043.937.195 1.446.327 1.785.175.45.383.77.719 1.106.336.336.656.544 1.106.72.339.132.848.284 1.785.327-1.013-.046-1.303-.056-3.663-.056zM12.315 7.27a4.902 4.902 0 110 9.804 4.902 4.902 0 010-9.804zm0 2.16a2.742 2.742 0 100 5.484 2.742 2.742 0 000-5.484zm5.224-3.532a1.44 1.44 0 110 2.88 1.44 1.44 0 010-2.88z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-rose-600 transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-rose-600 transition-colors">AirCover</Link></li>
              <li><Link href="#" className="hover:text-rose-600 transition-colors">Safety Information</Link></li>
              <li><Link href="#" className="hover:text-rose-600 transition-colors">Cancellation Options</Link></li>
              <li><Link href="#" className="hover:text-rose-600 transition-colors">Report a Concern</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-rose-600 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-rose-600 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-rose-600 transition-colors">Investors</Link></li>
              <li><Link href="#" className="hover:text-rose-600 transition-colors">Newsroom</Link></li>
              <li><Link href="#" className="hover:text-rose-600 transition-colors">Airbnb.org</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">📍</span>
                <span>123 Hotel Street, Travel City, TC 90210</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <span>support@pandastay.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} PandaStay, Inc. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-900 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}