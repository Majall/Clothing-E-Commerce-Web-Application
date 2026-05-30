import { jsPDF } from 'jspdf'

export const downloadInvoice = (order) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 40
  let y = margin

  const line = () => {
    doc.setDrawColor(220, 220, 220)
    doc.line(margin, y, pageWidth - margin, y)
    y += 12
  }

  const text = (content, x, fontSize = 10, style = 'normal', color = [30, 30, 30]) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', style)
    doc.setTextColor(...color)
    doc.text(content, x, y)
  }

  const row = (label, value, bold = false) => {
    text(label, margin, 10, bold ? 'bold' : 'normal')
    text(value, pageWidth - margin, 10, bold ? 'bold' : 'normal')
    doc.setFont('helvetica', 'normal')
    const valueWidth = doc.getTextWidth(value)
    doc.text(value, pageWidth - margin - valueWidth, y)
    doc.text(label, margin, y)
    y += 18
  }

  // Header
  doc.setFillColor(20, 20, 20)
  doc.rect(0, 0, pageWidth, 60, 'F')
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('INVOICE', margin, 38)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('ForeverYou Fashion', pageWidth - margin - doc.getTextWidth('ForeverYou Fashion'), 30)
  doc.text('fashion@foreveryou.com', pageWidth - margin - doc.getTextWidth('fashion@foreveryou.com'), 44)

  y = 80

  // Order meta
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(30, 30, 30)
  doc.text(`Order ID: ${order.id}`, margin, y)
  y += 16
  doc.setFont('helvetica', 'normal')
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, margin, y)
  y += 16
  doc.text(`Status: ${order.status}`, margin, y)
  y += 24

  line()

  // Shipping address
  if (order.shippingAddress) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('SHIP TO', margin, y)
    y += 14
    doc.setFont('helvetica', 'normal')
    const addr = order.shippingAddress
    const addrLines = [
      addr.fullName,
      addr.line1,
      addr.line2,
      `${addr.city}${addr.state ? ', ' + addr.state : ''} ${addr.postalCode || ''}`.trim(),
      addr.country,
      addr.phone,
    ].filter(Boolean)
    addrLines.forEach((l) => {
      doc.text(l, margin, y)
      y += 14
    })
    y += 8
    line()
  }

  // Items header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text('ITEM', margin, y)
  doc.text('QTY', 320, y)
  doc.text('UNIT', 380, y)
  const totalLabel = 'TOTAL'
  doc.text(totalLabel, pageWidth - margin - doc.getTextWidth(totalLabel), y)
  y += 8
  line()

  // Items
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 30, 30)
  doc.setFontSize(9.5)
  order.items.forEach((item) => {
    const name = item.product?.name || item.productId
    const detail = `${name} — ${item.size}${item.color ? ' / ' + item.color : ''}`
    const detailLines = doc.splitTextToSize(detail, 260)
    doc.text(detailLines, margin, y)
    doc.text(String(item.quantity), 320, y)
    doc.text(`৳${item.product?.price ?? '—'}`, 380, y)
    const lt = `৳${item.lineTotal}`
    doc.text(lt, pageWidth - margin - doc.getTextWidth(lt), y)
    y += detailLines.length > 1 ? detailLines.length * 13 : 18
  })

  y += 4
  line()

  // Totals
  const totals = [
    ['Subtotal', `৳${order.subtotal ?? order.total}`],
    ...(order.discount ? [['Discount', `-৳${order.discount}`]] : []),
    ['Shipping', order.shipping ? `৳${order.shipping}` : 'Free'],
    ['TOTAL', `৳${order.total}`],
  ]

  totals.forEach(([label, value], index) => {
    const isFinal = index === totals.length - 1
    doc.setFont('helvetica', isFinal ? 'bold' : 'normal')
    doc.setFontSize(isFinal ? 11 : 9.5)
    doc.setTextColor(isFinal ? 20 : 60, isFinal ? 20 : 60, isFinal ? 20 : 60)
    doc.text(label, margin, y)
    const valW = doc.getTextWidth(value)
    doc.text(value, pageWidth - margin - valW, y)
    y += isFinal ? 22 : 18
  })

  // Footer
  y += 10
  line()
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(8.5)
  doc.setTextColor(140, 140, 140)
  doc.text('Thank you for shopping with ForeverYou. This is a computer-generated invoice.', margin, y)

  doc.save(`invoice-${order.id}.pdf`)
}
