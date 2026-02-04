import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Variant {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  price: number;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [Variant], default: [] })
  variants: Variant[];

  @Prop()
  description?: string;

  @Prop()
  image?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
