import { Link } from 'react-router-dom'
import { Leaf, MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import { useState } from 'react'

// Social icon SVGs (lucide-react does not export these)
const FacebookIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)
const InstagramIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)
const TwitterIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const YoutubeIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
  </svg>
)

const LINKS = {
  'Quick Links':   [['Home','/'],['Shop','/marketplace'],['Categories','/marketplace?cat=all'],['About Us','#about'],['Contact','/contact']],
  'For Farmers':   [['Become a Seller','/register?role=farmer'],['Farmer Dashboard','/farmer'],['Sell on GreenBasket','#'],['Success Stories','#'],['Farmer Support','#']],
  'Customer Care': [['Track Your Order','/customer/orders'],['Return Policy','#'],['FAQ','#faq'],['Help Center','#'],['Shipping Info','#']],
}

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <footer className="bg-primary-900 text-white" role="contentinfo">

      {/* CTA Banner */}
      <div className="bg-primary-700 py-12">
        <div className="section-wrapper flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-display font-bold mb-1">Get fresh deals in your inbox</h3>
            <p className="text-primary-200 text-sm">Weekly offers, new arrivals, and farming tips — no spam ever.</p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-6 py-3">
              <span className="text-2xl">🎉</span>
              <span className="font-semibold">You&apos;re subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 w-full md:w-auto">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/20
                  text-white placeholder:text-primary-300 focus:outline-none focus:border-white/40
                  focus:bg-white/15 transition-all"
                required
              />
              <button type="submit" className="btn-md btn-primary bg-leaf hover:bg-green-400 rounded-xl whitespace-nowrap">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="section-wrapper py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-leaf rounded-xl flex items-center justify-center">
                <Leaf size={22} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display font-800 text-xl leading-tight">
                  <span className="text-white">Green</span><span className="text-leaf">Basket</span>
                </div>
                <p className="text-2xs text-primary-300">Fresh. Live Well.</p>
              </div>
            </Link>
            <p className="text-primary-300 text-sm leading-relaxed mb-6 max-w-xs">
              India&apos;s freshest produce marketplace — connecting farmers directly with conscious consumers since 2021.
            </p>

            <div className="flex flex-col gap-3 text-sm text-primary-300">
              <div className="flex items-center gap-2"><MapPin size={15} className="text-leaf flex-shrink-0" /> 42, Farm Tech Park, Pune, Maharashtra 411001</div>
              <div className="flex items-center gap-2"><Phone size={15} className="text-leaf flex-shrink-0" /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><Mail  size={15} className="text-leaf flex-shrink-0" /> hello@greenbasket.in</div>
            </div>

            {/* Socials */}
            <div className="flex gap-3 mt-6">
              {[
                { icon: FacebookIcon,  href: '#', label: 'Facebook' },
                { icon: InstagramIcon, href: '#', label: 'Instagram' },
                { icon: TwitterIcon,   href: '#', label: 'Twitter' },
                { icon: YoutubeIcon,   href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center
                    text-primary-300 hover:bg-leaf hover:text-white transition-all duration-200">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold text-white mb-4">{heading}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link to={href}
                      className="text-sm text-primary-300 hover:text-leaf transition-colors duration-200
                        flex items-center gap-1.5 group">
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-5">
        <div className="section-wrapper flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-primary-400 text-xs">
            © {new Date().getFullYear()} GreenBasket Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['🔒 SSL Secured', '🌿 Carbon Neutral', '🇮🇳 Made in India'].map(b => (
              <span key={b} className="text-primary-400 text-xs">{b}</span>
            ))}
          </div>
          <div className="flex gap-4 text-xs text-primary-400">
            <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms</Link>
            <Link to="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
