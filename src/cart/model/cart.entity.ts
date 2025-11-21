import { Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, Column, ManyToOne, Relation } from "typeorm";

//Schema
import { Product } from "@/product/model/product.entity";
import { User } from "@/user/model/user.entity";
import { Seller } from "@/seller/entities/seller.entity";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn("identity")
    id: string;

    @ManyToOne(() => Product)
    productId: Relation<Product>;

    @ManyToOne(() => User)
    user: Relation<User>;

    @ManyToOne(() => Seller)
    seller: Relation<Seller>;

    @Column({ type: "numeric" })
    reserved: number;

    @Column({ type: "json", nullable: true })
    attributes: { id: string, name: string, variant: string }[];

    @UpdateDateColumn({ type: "timestamptz" })
    updated_at: Date;

    @CreateDateColumn({ type: "timestamptz" })
    created_at: Date;
}