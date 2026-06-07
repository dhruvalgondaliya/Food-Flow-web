import {
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useMenu } from "../../ContextProvider/MenuContext";
import { getCategoryImageUrl } from "../Utiles/mediaUrl";
import bg from "../../assets/footer-bg-1.png";
import Logo from "../../assets/Logo.png";

const Footer = () => {
  const { categories = [] } = useMenu();
  const menuPreview = categories.slice(0, 6);

  return (
    <footer
      className="relative border-t-4 border-[#B52929] pb-24 text-white xl:pb-0"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/72" aria-hidden />
      <div className="relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <img
                  src={Logo}
                  alt=""
                  className="h-12 w-auto object-contain sm:h-14"
                />
                <span className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Food Flow
                </span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-gray-300">
                A moments of delivered on right time &amp; place
              </p>
              <a
                href="tel:9313759955"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-black/50 px-4 py-3 ring-1 ring-white/15 transition hover:bg-black/70"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5CA48] text-gray-900">
                  <Phone className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span className="text-lg font-bold tracking-tight text-[#F5CA48]">
                  9313759955
                </span>
              </a>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5CA48]">
                  Our menu
                </h3>
                <ul className="mt-5 space-y-3">
                  {menuPreview.map((category) => {
                    const catImg = getCategoryImageUrl(category);
                    return (
                      <li key={category._id}>
                        <Link
                          to="/detail-Items"
                          state={{
                            selectedCategory: category,
                            categories,
                            showTabs: true,
                          }}
                          className="flex items-center gap-3 text-sm text-gray-200 transition hover:text-[#F5CA48] capitalize"
                        >
                          {catImg ? (
                            <img
                              src={catImg}
                              alt=""
                              className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white/10"
                              loading="lazy"
                            />
                          ) : (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-[#F5CA48]">
                              {category.name?.[0] ?? "?"}
                            </span>
                          )}
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5CA48]">
                  Info
                </h3>
                <ul className="mt-5 space-y-2.5 text-sm">
                  <li>
                    <Link
                      to="/about"
                      className="text-gray-200 transition hover:text-white"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/userReview"
                      className="text-gray-200 transition hover:text-white"
                    >
                      Contact us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/detail-Items"
                      state={{ categories, showTabs: true }}
                      className="text-gray-200 transition hover:text-white"
                    >
                      Our menu
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="text-gray-200 transition hover:text-white"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
                <div className="mt-6 space-y-3 text-sm text-gray-300">
                  <p className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#B52929]" />
                    <span>
                      PO Box 16122 Collins Street West
                      <br />
                      Victoria 8007 Ahemdabad
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-[#B52929]" />
                    <a
                      href="mailto:chauhanparth6635@gmail.com"
                      className="break-all hover:text-white"
                    >
                      chauhanparth6635@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <div className="rounded-2xl bg-black/40 p-5 ring-1 ring-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F5CA48]">
                    <Clock className="h-4 w-4 text-[#B52929]" />
                    Opening hours
                  </div>
                  <ul className="mt-4 space-y-2.5 text-sm text-gray-200">
                    <li className="flex justify-between gap-4">
                      <span>Mon – Tues</span>
                      <span className="text-white/90">6:00 am – 10:00 pm</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>Wed – Thurs</span>
                      <span className="text-white/90">6:00 am – 10:00 pm</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>Lunch</span>
                      <span className="text-white/90">Everyday</span>
                    </li>
                    <li className="flex items-center justify-between gap-4">
                      <span>Sunday</span>
                      <span className="rounded-md bg-[#B52929] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Closed
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 pt-8 sm:flex-row">
            <p className="text-center text-xs text-gray-400 sm:text-left">
              © {new Date().getFullYear()} Food Flow. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <a href="#" className="hover:text-white">
                Privacy policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of service
              </a>
              <div className="flex gap-2">
                <a
                  href="#"
                  className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 transition hover:bg-[#B52929] hover:ring-[#B52929]"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 transition hover:bg-[#B52929] hover:ring-[#B52929]"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 transition hover:bg-[#B52929] hover:ring-[#B52929]"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="rounded-lg bg-white/5 p-2 ring-1 ring-white/10 transition hover:bg-[#B52929] hover:ring-[#B52929]"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
