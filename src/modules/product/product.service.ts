import { ProductModel } from "./product.model";
import { GetProductsQuery, PaginatedProductsResponse, ProductResponse } from "./product.types";

export class ProductService {
  async getProducts(query: GetProductsQuery): Promise<PaginatedProductsResponse> {
    const {
      page = 1,
      limit = 9,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    // Validate category if provided
    const validCategories = ["sweaters", "jackets", "pants", "hoodies"];
    if (category && !validCategories.includes(category)) {
      throw new Error("Invalid category. Must be one of: sweaters, jackets, pants, hoodies");
    }

    // Build filter object
    const filter: any = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) {
        filter.price.$gte = minPrice;
      }
      if (maxPrice !== undefined) {
        filter.price.$lte = maxPrice;
      }
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort: any = {};
    if (sortBy === "rating") {
      sort["rating.average"] = sortOrder === "asc" ? 1 : -1;
    } else {
      sort[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, totalProducts] = await Promise.all([
      ProductModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ProductModel.countDocuments(filter),
    ]);

    // Transform products - convert Map to plain object if needed
    const transformedProducts: ProductResponse[] = products.map((product: any) => {
      let stockObj = {};
      if (product.stock) {
        // Check if it's already a plain object or a Map
        if (product.stock instanceof Map) {
          stockObj = Object.fromEntries(product.stock);
        } else if (typeof product.stock === 'object') {
          stockObj = product.stock;
        }
      }
      
      return {
        ...product,
        stock: stockObj,
        sizes: product.sizes || [],
        colors: product.colors || [],
        totalStock: product.totalStock || 0,
        inStock: product.inStock !== undefined ? product.inStock : true,
      };
    });

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products: transformedProducts,
      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getProductById(id: string): Promise<ProductResponse> {
    const product: any = await ProductModel.findOne({ _id: id, isActive: true }).lean();

    if (!product) {
      throw new Error("Product not found");
    }

    // Convert Map to plain object if needed
    let stockObj = {};
    if (product.stock) {
      if (product.stock instanceof Map) {
        stockObj = Object.fromEntries(product.stock);
      } else if (typeof product.stock === 'object') {
        stockObj = product.stock;
      }
    }

    return {
      ...product,
      stock: stockObj,
      sizes: product.sizes || [],
      colors: product.colors || [],
      totalStock: product.totalStock || 0,
      inStock: product.inStock !== undefined ? product.inStock : true,
    };
  }
}
