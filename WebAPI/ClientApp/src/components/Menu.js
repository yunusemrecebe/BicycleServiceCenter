/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import { Navigation } from "react-minimal-side-navigation";
import { useHistory, useLocation } from "react-router-dom";
//import Icon from "awesome-react-icons";
import React, { useState } from "react";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

const NavSidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <React.Fragment>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
          }`}
      >
        <div className="flex items-center justify-center mt-10 text-center py-6">
        </div>

        <Navigation
          activeItemId={location.pathname}
          onSelect={({ itemId }) => {
            history.push(itemId);
          }}
          items={[
            {
              title: "Anasayfa",
              itemId: "/",
            },
            {
              title: "Servis Hizmetleri",
              itemId: "/servis/listele",
              subNav: [
                {
                  title: "Servis Hizmeti Ekle",
                  itemId: "/servis/ekle"
                }
              ]
            },
            {
              title: "Müşteriler",
              itemId: "/musteri/listele",
              subNav: [
                {
                  title: "Müşteri Ekle",
                  itemId: "/musteri/ekle"
                }
              ]
            },
            {
              title: "Bisikletler",
              itemId: "/bisiklet/listele",
              subNav: [
                {
                  title: "Bisiklet Ekle",
                  itemId: "/bisiklet/ekle"
                },
                {
                  title: "Bisiklet Markaları",
                  itemId: "/bisiklet/marka/listele"
                },
                {
                  title: "Bisiklet Markası Ekle",
                  itemId: "/bisiklet/marka/ekle"
                },
                {
                  title: "Bisiklet Modelleri",
                  itemId: "/bisiklet/model/listele"
                },
                {
                  title: "Bisiklet Modeli Ekle",
                  itemId: "/bisiklet/model/ekle"
                }
              ]
            },
            {
              title: "Ürünler",
              itemId: "/urun/listele",
              subNav: [
                {
                  title: "Ürün Ekle",
                  itemId: "/urun/ekle"
                },
                {
                  title: "Ürün Markaları",
                  itemId: "/urun/marka/listele"
                },
                {
                  title: "Ürün Markası Ekle",
                  itemId: "/urun/marka/ekle"
                },
                {
                  title: "Ürün Kategorileri",
                  itemId: "/urun/kategori/listele"
                },
                {
                  title: "Ürün Kartegorisi Ekle",
                  itemId: "/urun/kategori/ekle"
                },
              ]
            },
            {
              title: "Stok Yonetimi",
              itemId: "/stok/listele",
              subNav: [
                {
                  title: "Ürün Ekle",
                  itemId: "/stok/ekle"
                },
              ]
            },
            {
              title: "Personeller",
              itemId: "/personel/listele",
              subNav: [
                {
                  title: "Ürün Ekle",
                  itemId: "/personel/ekle"
                },
              ]
            },
            {
              title: "Raporlar",
              subNav: [
                {
                  title: "Müşteri Raporu",
                  itemId: "/rapor/musteri"
                },
                {
                  title: "Personel Raporu",
                  itemId: "/rapor/personel"
                },
                {
                  title: "Ürün Raporu",
                  itemId: "/rapor/urun"
                },
              ]
            }
          ]}
        />
      </div>
    </React.Fragment>
  );
};


export default NavSidebar;