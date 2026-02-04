import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getCategories(): Promise<string[]> {
    return this.productModel.distinct('category').exec();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Product[]> {
    const skip = (page - 1) * limit;
    return this.productModel.find().skip(skip).limit(limit).exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, product, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findByCategory(
    category: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Product[]> {
    const skip = (page - 1) * limit;
    return this.productModel.find({ category }).skip(skip).limit(limit).exec();
  }
}
