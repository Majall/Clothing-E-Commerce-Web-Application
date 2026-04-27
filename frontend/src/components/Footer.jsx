const Footer = () => (
  <footer className='mt-16 border-t border-gray-200 py-8 text-sm text-gray-600'>
    <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
      <p>© {new Date().getFullYear()} E-Commerce Web. All rights reserved.</p>
      <p>Fast delivery • Secure checkout • Easy returns</p>
    </div>
  </footer>
)

export default Footer
