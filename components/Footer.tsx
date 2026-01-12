export default function Footer() {
    return (
        <footer className="w-full bg-[#121212] py-12 text-center text-gray-600 font-mono text-sm z-20 relative border-t border-white/5">
            <div className="flex justify-center gap-6 mb-4">
                <a href="mailto:supratimdhara0@gmail.com" className="hover:text-white transition-colors font-mono uppercase">[ Email ]</a>
                <a href="https://linkedin.com/in/supratimdhara/" target="_blank" className="hover:text-white transition-colors font-mono uppercase">[ LinkedIn ]</a>
                <a href="https://github.com/supratim1609" target="_blank" className="hover:text-white transition-colors font-mono uppercase">[ GitHub ]</a>
                <a href="https://medium.com/@supratimdhara0" target="_blank" className="hover:text-white transition-colors font-mono uppercase">[ Medium ]</a>
            </div>
            <p className="uppercase">
                © {new Date().getFullYear()} Supratim Dhara. Built with Next.js & Framer Motion.
            </p>
        </footer>
    );
}
