"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import {
  useGetProvincesQuery,
  useGetCitiesQuery,
  useGetDistrictsQuery,
  useCreateShopMutation,
} from "@/services/shop/open-shop/open-shop.service";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Swal from "sweetalert2";

export default function CreateShopForm({
  defaultEmail,
  onClose,
}: {
  defaultEmail: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: defaultEmail,
    address: "",
    description: "",
    latitude: 0,
    longitude: 0,
    status: true,
    logo: null as File | null,
    banner: null as File | null,
    rajaongkir_province_id: 0,
    rajaongkir_city_id: 0,
    rajaongkir_district_id: 0,
  });

  const { data: provinces = [], isLoading: loadingProvince } =
    useGetProvincesQuery();
  const { data: cities = [], isLoading: loadingCity } = useGetCitiesQuery(
    form.rajaongkir_province_id,
    {
      skip: !form.rajaongkir_province_id,
    }
  );
  const { data: districts = [], isLoading: loadingDistrict } =
    useGetDistrictsQuery(form.rajaongkir_city_id, {
      skip: !form.rajaongkir_city_id,
    });

  const [createShop, { isLoading }] = useCreateShopMutation();

  const handleSubmit = async () => {
    const fd = new FormData();
    for (const [key, value] of Object.entries(form)) {
      if (value === null || value === undefined) continue; 

      if (value instanceof File) {
        fd.append(key, value);
      } else if (typeof value === "boolean") {
        fd.append(key, value ? "1" : "0"); 
      } else {
        fd.append(key, String(value));
      }
    }

    try {
      await createShop(fd).unwrap();
      Swal.fire("Berhasil", "Toko berhasil dibuat", "success");
      onClose();
    } catch (err) {
      Swal.fire("Error", "Gagal membuat toko", "error");
      console.error(err);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold mb-4">Tambah Toko</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nama Toko</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <Label>Telepon</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <Label>Email</Label>
          <Input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <Label>Alamat</Label>
          <Textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <Label>Deskripsi</Label>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <Label>Latitude</Label>
          <Input
            type="number"
            value={form.latitude}
            onChange={(e) =>
              setForm({ ...form, latitude: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Longitude</Label>
          <Input
            type="number"
            value={form.longitude}
            onChange={(e) =>
              setForm({ ...form, longitude: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Logo</Label>
          <Input
            type="file"
            onChange={(e) =>
              setForm({ ...form, logo: e.target.files?.[0] || null })
            }
          />
        </div>
        <div>
          <Label>Banner</Label>
          <Input
            type="file"
            onChange={(e) =>
              setForm({ ...form, banner: e.target.files?.[0] || null })
            }
          />
        </div>
        <div>
          <Label>Provinsi</Label>
          <Combobox
            value={form.rajaongkir_province_id}
            onChange={(id) => {
              setForm({
                ...form,
                rajaongkir_province_id: id,
                rajaongkir_city_id: 0,
                rajaongkir_district_id: 0,
              });
            }}
            data={provinces}
            isLoading={loadingProvince}
            getOptionLabel={(item) => item.name}
          />
        </div>
        <div>
          <Label>Kota</Label>
          <Combobox
            value={form.rajaongkir_city_id}
            onChange={(id) =>
              setForm({
                ...form,
                rajaongkir_city_id: id,
                rajaongkir_district_id: 0,
              })
            }
            data={cities}
            isLoading={loadingCity}
            getOptionLabel={(item) => item.name}
            disabled={!form.rajaongkir_province_id}
          />
        </div>
        <div className="col-span-2">
          <Label>Kecamatan</Label>
          <Combobox
            value={form.rajaongkir_district_id}
            onChange={(id) => setForm({ ...form, rajaongkir_district_id: id })}
            data={districts}
            isLoading={loadingDistrict}
            getOptionLabel={(item) => item.name}
            disabled={!form.rajaongkir_city_id}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Batal
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          Simpan
        </Button>
      </div>
    </div>
  );
}