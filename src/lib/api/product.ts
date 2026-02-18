import type { Product } from "../../modules/types/product";


const mockProducts: Product[] = [
    // Standard Rate (7.5%) - Professional Services
    {
      id: "1",
      name: "Business Consulting",
      category: "Services",
      basePrice: 250000,
      vatRate: 7.5,
      description: "Professional business consulting and strategy services",
    },
    {
      id: "2",
      name: "Tax Advisory",
      category: "Services",
      basePrice: 300000,
      vatRate: 7.5,
      description: "Expert tax advisory and compliance planning",
    },
    {
      id: "3",
      name: "Audit Services",
      category: "Services",
      basePrice: 450000,
      vatRate: 7.5,
      description: "Comprehensive financial audit and assurance",
    },
    {
      id: "4",
      name: "Software License",
      category: "Products",
      basePrice: 199000,
      vatRate: 7.5,
      description: "Enterprise software license (annual subscription)",
    },
    {
      id: "5",
      name: "Training Program",
      category: "Services",
      basePrice: 150000,
      vatRate: 7.5,
      description: "Professional development and certification training",
    },
    {
      id: "6",
      name: "Cloud Hosting",
      category: "Products",
      basePrice: 99000,
      vatRate: 7.5,
      description: "Monthly cloud hosting and infrastructure",
    },
    {
      id: "7",
      name: "Legal Advisory",
      category: "Services",
      basePrice: 350000,
      vatRate: 7.5,
      description: "Legal consultation and contract review",
    },
    {
      id: "8",
      name: "Data Analytics",
      category: "Services",
      basePrice: 275000,
      vatRate: 7.5,
      description: "Advanced data analytics and business insights",
    },
    {
      id: "9",
      name: "Cybersecurity Assessment",
      category: "Services",
      basePrice: 500000,
      vatRate: 7.5,
      description: "Security vulnerability assessment and penetration testing",
    },
    {
      id: "10",
      name: "HR Consulting",
      category: "Services",
      basePrice: 225000,
      vatRate: 7.5,
      description: "Human resources strategy and workforce planning",
    },
    {
      id: "11",
      name: "Marketing Strategy",
      category: "Services",
      basePrice: 320000,
      vatRate: 7.5,
      description: "Digital marketing and brand strategy consulting",
    },
    {
      id: "12",
      name: "Banking Services",
      category: "Financial",
      basePrice: 50000,
      vatRate: 7.5,
      description: "Card issuance, POS fees, and USSD transactions",
    },
    {
      id: "13",
      name: "Enterprise CRM",
      category: "Products",
      basePrice: 449000,
      vatRate: 7.5,
      description: "Customer relationship management platform",
    },
    {
      id: "14",
      name: "Project Management Tool",
      category: "Products",
      basePrice: 89000,
      vatRate: 7.5,
      description: "Collaborative project management software",
    },
    {
      id: "15",
      name: "Compliance Audit",
      category: "Services",
      basePrice: 600000,
      vatRate: 7.5,
      description: "Regulatory compliance review and certification",
    },
    {
      id: "16",
      name: "IT Infrastructure",
      category: "Products",
      basePrice: 1200000,
      vatRate: 7.5,
      description: "Network and server infrastructure setup",
    },
    {
      id: "17",
      name: "Business Intelligence",
      category: "Products",
      basePrice: 379000,
      vatRate: 7.5,
      description: "BI dashboard and reporting platform",
    },
    {
      id: "18",
      name: "Change Management",
      category: "Services",
      basePrice: 340000,
      vatRate: 7.5,
      description: "Organizational change and transformation consulting",
    },
    // Zero-Rated (0%) - Exports & Diplomatic
    {
      id: "19",
      name: "Export Consulting",
      category: "Zero-Rated",
      basePrice: 420000,
      vatRate: 0,
      description: "Services for goods exported outside Nigeria",
    },
    {
      id: "20",
      name: "Diplomatic Services",
      category: "Zero-Rated",
      basePrice: 380000,
      vatRate: 0,
      description: "Goods and services for diplomatic missions",
    },
    {
      id: "21",
      name: "Humanitarian Project Support",
      category: "Zero-Rated",
      basePrice: 299000,
      vatRate: 0,
      description: "Donor-funded humanitarian project services",
    },
    {
      id: "22",
      name: "EPZ/FTZ Equipment",
      category: "Zero-Rated",
      basePrice: 850000,
      vatRate: 0,
      description: "Machinery for Export Processing Zones",
    },
    // Exempt (0%) - Essential Services
    {
      id: "23",
      name: "Medical Supplies",
      category: "Exempt",
      basePrice: 75000,
      vatRate: 0,
      description: "Essential medical products and pharmaceuticals",
    },
    {
      id: "24",
      name: "Educational Materials",
      category: "Exempt",
      basePrice: 45000,
      vatRate: 0,
      description: "Books, journals, and educational resources",
    },
    {
      id: "25",
      name: "Basic Food Items",
      category: "Exempt",
      basePrice: 25000,
      vatRate: 0,
      description: "Rice, beans, yam, and essential foodstuffs",
    },
    {
      id: "26",
      name: "Agricultural Feeds",
      category: "Exempt",
      basePrice: 35000,
      vatRate: 0,
      description: "Animal feeds and agricultural chemicals",
    },
    {
      id: "27",
      name: "Healthcare Services",
      category: "Exempt",
      basePrice: 120000,
      vatRate: 0,
      description: "Medical consultations and treatments",
    },
    {
      id: "28",
      name: "Airline Tickets",
      category: "Zero-Rated",
      basePrice: 180000,
      vatRate: 0,
      description: "Commercial airline transportation services",
    },
    // More Standard Rate Services
    {
      id: "29",
      name: "M&A Advisory",
      category: "Services",
      basePrice: 750000,
      vatRate: 7.5,
      description: "Mergers and acquisitions due diligence",
    },
    {
      id: "30",
      name: "Sustainability Consulting",
      category: "Services",
      basePrice: 290000,
      vatRate: 7.5,
      description: "ESG strategy and sustainability reporting",
    },
  ];
  
  export const fetchProducts = async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 300);
    });
  }
  
  export const   fetchProductById = async (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts.find((p) => p.id === id));
      }, 150);
    });
  }
  