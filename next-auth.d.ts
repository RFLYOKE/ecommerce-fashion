/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      token: string;
      phone: string;
      roles: {
        id: number;
        name: string;
      }[];
      shop: {
        id: number;
        user_id: number;
        name: string;
        slug: string;
        phone: string;
        email: string;
        address: string;
        description: string;
        latitude: number | null;
        longitude: number | null;
        rating: string;
        total_reviews: number;
        status: boolean;
        created_at: string;
        updated_at: string;
        rajaongkir_province_id: number;
        rajaongkir_city_id: number;
        rajaongkir_district_id: string;
        logo: string;
        banner: string;
      };
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    token: string;
    phone: string;
    roles: {
      id: number;
      name: string;
    }[];
    shop: {
      id: number;
      user_id: number;
      name: string;
      slug: string;
      phone: string;
      email: string;
      address: string;
      description: string;
      latitude: number | null;
      longitude: number | null;
      rating: string;
      total_reviews: number;
      status: boolean;
      created_at: string;
      updated_at: string;
      rajaongkir_province_id: number;
      rajaongkir_city_id: number;
      rajaongkir_district_id: string;
      logo: string;
      banner: string;
    };
  }
}
