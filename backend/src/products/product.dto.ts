import { IsString,Min,Max,IsInt,IsUrl } from "class-validator";
export class ProductDto {
  @IsString({ message: 'Product name must be a string' })
  name: string;
    @IsString({ message: 'Product description must be a string' })
    description: string;
    @IsInt({ message: 'Price must be an integer' })
    @Min(0, { message: 'Price must be at least 0' })
    price: number;
    @IsInt({ message: 'Stock must be an integer' })
    @Min(0, { message: 'Stock must be at least 0' })
    stock: number;
    @IsUrl({}, { message: 'Image URL must be a valid URL' })
    imageUrl: string;
    @IsInt({ message: 'Brand ID must be an integer' })
    brandId?: number;
    @IsInt({ message: 'Store ID must be an integer' })
    storeId: number;
}