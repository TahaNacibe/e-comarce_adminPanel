

type ProductsData = {
  productName: string;
  productCount: number;
  productPrice: number;
  productTotal: number;
};

export default async function createReceipt({
  clientName,
  totalPrice,
  createdAt,
  productsData,
  fullAddress,
  shopDetails
}: {
  clientName: string;
  totalPrice: number;
  createdAt: Date;
  productsData: ProductsData[];
    fullAddress: string;
    shopDetails:any
}) {
  // Helper function to create separator lines
  const createLine = (char: string = "=", length: number = 58) => char.repeat(length) + "\n";

  
  
  // Helper function to center text
  const centerText = (text: string, width: number = 58) => {
    const padding = Math.max(0, width - text.length) / 2;
    return " ".repeat(Math.floor(padding)) + text + " ".repeat(Math.ceil(padding));
  };

  // Helper function to format currency
  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  // Helper function to create justified text rows
  const createRow = (left: string, right: string, width: number = 58) => {
    const padding = width - left.length - right.length;
    return left + " ".repeat(Math.max(0, padding)) + right + "\n";
  };

  // Format the date
  const formattedDate = createdAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Build the receipt
  let receipt = "";
  
  // Header
  receipt += createLine();
  receipt += centerText("SALES RECEIPT") + "\n";
  receipt += createLine("-");
  
  if (shopDetails) {
    // Business Info (you can customize this)
    receipt += centerText(shopDetails.shopName) + "\n";
    receipt += centerText(shopDetails.address) + "\n";
    receipt += centerText("Constantine") + "\n";
    receipt += centerText(shopDetails.phoneNumber) + "\n";
    receipt += createLine("-");
  }

  // Order Details
  receipt += `Date: ${formattedDate}\n`;
  receipt += `Customer: ${clientName}\n`;
  receipt += "Shipping Address:\n";
  
  // Format address with proper wrapping
  const addressLines = fullAddress.match(/.{1,48}/g) || [];
  addressLines.forEach(line => {
    receipt += `  ${line.trim()}\n`;
  });
  
  receipt += createLine("-");
  
  // Header for items
  receipt += createRow("Item Description", "Amount");
  receipt += createLine("-");
  
  // Product details
  productsData.forEach((product) => {
    receipt += `${product.productName}\n`;
    receipt += createRow(
      `  ${product.productCount} x ${formatCurrency(product.productPrice)}`,
      formatCurrency(product.productTotal)
    );
  });
  
  receipt += createLine("-");
  
  // Totals
  receipt += createRow("Subtotal:", formatCurrency(totalPrice));
  receipt += createRow("Tax:", formatCurrency(totalPrice * 0.1)); // Assuming 10% tax
  receipt += createRow("Total:", formatCurrency(totalPrice * 1.1));
  
  receipt += createLine("=");
  
  // Footer
  receipt += centerText("Thank you for your business!") + "\n";
  receipt += centerText("Please keep this receipt for your records") + "\n";
  receipt += createLine();



  return receipt;
}