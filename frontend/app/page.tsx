import Link from "next/link"

const flats = [
  {
    type: "1BHK",
    price: 3000,
    badge: "Starter",
    description: "Perfect for singles or couples looking for a cozy, efficient space.",
    features: ["1 Bedroom", "1 Bathroom", "Balcony", "Parking", "24/7 Security"],
    sqft: "520 sq.ft",
    highlighted: false,
  },
  {
    type: "2BHK",
    price: 4000,
    badge: "Popular",
    description: "Ideal for small families with ample space and modern amenities.",
    features: ["2 Bedrooms", "2 Bathrooms", "Balcony", "Parking", "Club Access"],
    sqft: "820 sq.ft",
    highlighted: true,
  },
  {
    type: "3BHK",
    price: 5500,
    badge: "Premium",
    description: "Spacious luxury living for families who want the very best.",
    features: ["3 Bedrooms", "2 Bathrooms", "Large Balcony", "2 Parkings", "Gym Access"],
    sqft: "1150 sq.ft",
    highlighted: false,
  },
]

const amenities = [
  { icon: "🏊", label: "Swimming Pool" },
  { icon: "🏋️", label: "Fitness Center" },
  { icon: "🌿", label: "Landscaped Gardens" },
  { icon: "🔒", label: "24/7 Security" },
  { icon: "🅿️", label: "Covered Parking" },
  { icon: "⚡", label: "Power Backup" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8faf8] overflow-x-hidden">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="font-semibold text-gray-800 text-lg">SocietyPortal</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500 font-medium">
            <a href="#flats" className="hover:text-green-600 transition-colors">Flats</a>
            <a href="#amenities" className="hover:text-green-600 transition-colors">Amenities</a>
            <a href="#contact" className="hover:text-green-600 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-green-700 font-medium transition-colors">
              Resident Login
            </Link>
            <Link href="/admin/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-colors font-medium">
              Admin →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 px-6 text-center border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
            New Flats Available — 2026
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
            Your Perfect Home<br />
            <span className="text-green-600">Awaits You</span>
          </h1>

          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Discover thoughtfully designed flats with world-class amenities. Manage subscriptions, payments, and more — all from one portal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors">
              Enter as Resident →
            </Link>
            <Link href="/admin/login" className="bg-white border border-gray-200 text-gray-800 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Admin Portal →
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 flex justify-center gap-12">
            {[["3", "Flat Types"], ["500+", "Residents"], ["99%", "Satisfaction"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{num}</div>
                <div className="text-xs text-gray-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flat Cards */}
      <section id="flats" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Offerings</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Space</h2>
            <p className="text-gray-400 max-w-md mx-auto">Thoughtfully crafted living spaces for every lifestyle and budget.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {flats.map((flat) => (
              <div
                key={flat.type}
                className={`bg-white rounded-2xl border-2 overflow-hidden transition-shadow hover:shadow-lg ${
                  flat.highlighted ? "border-green-500 shadow-md shadow-green-100" : "border-gray-100 shadow-sm"
                }`}
              >
                {/* Card top */}
                <div className={`p-6 ${flat.highlighted ? "bg-green-600" : "bg-gray-900"} text-white`}>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block ${
                    flat.highlighted ? "bg-white text-green-700" : "bg-white/10 text-white"
                  }`}>
                    {flat.badge}
                  </span>
                  <div className="text-3xl font-extrabold mt-1">{flat.type}</div>
                  <div className="text-white/60 text-sm mt-0.5">{flat.sqft}</div>
                </div>

                {/* Price */}
                <div className="px-6 py-4 border-b border-gray-50">
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-extrabold text-gray-900">₹{flat.price.toLocaleString()}</span>
                    <span className="text-gray-400 text-sm mb-1">/month</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{flat.description}</p>
                </div>

                {/* Features */}
                <div className="px-6 py-5">
                  <ul className="space-y-2.5">
                    {flat.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                        <span className="w-4 h-4 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-green-600 text-[10px] flex-shrink-0">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 pb-6">
                  <Link
                    href="/login"
                    className={`w-full py-3 rounded-xl font-semibold text-sm text-center block transition-colors ${
                      flat.highlighted
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    Book This Flat →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-400 font-semibold text-sm uppercase tracking-widest mb-2">What's Included</p>
            <h2 className="text-4xl font-bold mb-3">Premium Amenities</h2>
            <p className="text-gray-400 max-w-md mx-auto">Every flat comes with access to our world-class facilities.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {amenities.map((a) => (
              <div key={a.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <span className="text-2xl">{a.icon}</span>
                <span className="font-medium text-gray-200 text-sm">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Move In?</h2>
          <p className="text-gray-400 mb-8">Join hundreds of happy residents already living in their dream home.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login" className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-green-700 transition-colors">
              Login as Resident
            </Link>
            <Link href="/admin/login" className="bg-gray-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-black transition-colors">
              Admin Access
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-2">Get In Touch</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:gauravrawat8433022@gmail.com"
              className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors rounded-2xl px-6 py-5 min-w-[260px]"
            >
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                ✉️
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Email</p>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors break-all">
                  gauravrawat8433022@gmail.com
                </p>
              </div>
            </a>

            <a
              href="tel:+918433022000"
              className="group flex items-center gap-4 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors rounded-2xl px-6 py-5 min-w-[260px]"
            >
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                📞
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">Phone</p>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                  +91 8433022XXX
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6 text-center bg-white">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-green-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-gray-700">SocietyPortal</span>
        </div>
        <p className="text-xs text-gray-400">© 2026 SocietyPortal. Secure • Fast • Reliable</p>
      </footer>

    </div>
  )
}