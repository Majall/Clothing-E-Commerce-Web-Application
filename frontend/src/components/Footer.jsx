const Footer = () => (
  <footer className='mt-16 border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400'>
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <p>© {new Date().getFullYear()} E-Commerce Web. All rights reserved.</p>
      <p>Fast delivery • Secure checkout • Easy returns</p>
    </div>
  </footer>
)

export default Footer
