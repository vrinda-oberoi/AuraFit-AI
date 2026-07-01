import { useEffect,useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assests/logo.png";
import ClothingCard from "../components/ClothingCard";
import ViewItemModal from "../components/ViewItemModal";
import { wardrobeCategories} from "../data/wardrobeData";

function WardrobeGallery() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
  fetchClothes();
}, []);

const fetchClothes = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:5000/api/clothes",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setItems(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.color.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [items, searchQuery, selectedCategory]);

  const uniqueCategories = useMemo(
    () => new Set(items.map((item) => item.category)).size,
    [items]
  );

  const recentlyAdded = useMemo(() => {
  return Math.min(items.length, 3);
}, [items]);

 const handleDelete = async (itemToDelete) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/clothes/${itemToDelete._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setItems((current) =>
      current.filter(
        (item) => item._id !== itemToDelete._id
      )
    );

    alert("Item Deleted Successfully!");
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to delete item"
    );
  }
};

  const handleEdit = (item) => {
  navigate(`/edit-item/${item._id}`);
};

  const handleView = (item) => {
    setSelectedItem(item);
  };

  return (
    <>
      <style>{`
        @keyframes galleryGlow {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.72; }
          50% { transform: scale(1.08) translateY(-10px); opacity: 1; }
        }
        @keyframes galleryFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(14px, -18px, 0); }
        }
        @keyframes galleryTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.55); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes galleryParticle {
          0% { opacity: 0; transform: translateY(0) scale(0.4); }
          30% { opacity: 0.9; }
          100% { opacity: 0; transform: translateY(-42px) scale(1.05); }
        }
        @keyframes galleryShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes butterflyLift {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-6deg) scale(1); }
          50% { transform: translate3d(0, -12px, 0) rotate(-2deg) scale(1.03); }
        }
        @keyframes butterflySparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.55); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes panelEnter {
          0% { opacity: 0; transform: translateY(16px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .gallery-title {
          background-size: 200% auto;
          animation: galleryShimmer 5s ease infinite;
        }
        .gallery-panel {
          animation: panelEnter 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#FF6B9D] via-[#C084FC] via-45% to-[#A855F7] px-4 py-6 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,183,197,0.52) 0%, rgba(192,132,252,0.42) 35%, rgba(167,139,250,0.48) 55%, rgba(251,191,146,0.36) 75%, rgba(244,114,182,0.4) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18), transparent 24%), radial-gradient(circle at 82% 24%, rgba(251,191,146,0.28), transparent 22%), radial-gradient(circle at 56% 78%, rgba(244,114,182,0.22), transparent 28%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute -left-16 top-8 h-64 w-64 rounded-full bg-[#C084FC]/50 blur-[110px]"
          style={{ animation: "galleryGlow 9s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#F472B6]/45 blur-[120px]"
          style={{ animation: "galleryGlow 11s ease-in-out infinite 1s" }}
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#FBBF94]/35 blur-[120px]"
          style={{ animation: "galleryFloat 10s ease-in-out infinite" }}
        />

        {[
          { top: "10%", left: "12%", delay: "0s", size: "4px" },
          { top: "22%", left: "84%", delay: "1.1s", size: "3px" },
          { top: "38%", left: "92%", delay: "2.4s", size: "4px" },
          { top: "58%", left: "8%", delay: "0.8s", size: "3px" },
          { top: "76%", left: "86%", delay: "3s", size: "5px" },
          { top: "84%", left: "20%", delay: "1.9s", size: "3px" },
        ].map((star, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute rounded-full bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.85)]"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animation: `galleryTwinkle 4s ease-in-out infinite ${star.delay}`,
            }}
          />
        ))}

        {[
          { top: "24%", left: "28%", delay: "0s" },
          { top: "36%", left: "70%", delay: "1.4s" },
          { top: "54%", left: "16%", delay: "2.7s" },
          { top: "66%", left: "74%", delay: "0.6s" },
          { top: "30%", left: "86%", delay: "1.9s" },
          { top: "74%", left: "48%", delay: "3.2s" },
        ].map((particle, index) => (
          <div
            key={index}
            aria-hidden="true"
            className="absolute h-1.5 w-1.5 rounded-full bg-white/90"
            style={{
              top: particle.top,
              left: particle.left,
              boxShadow: "0 0 10px rgba(255,255,255,0.75)",
              animation: `galleryParticle 5s ease-in-out infinite ${particle.delay}`,
            }}
          />
        ))}

        <main className="relative z-10 mx-auto max-w-7xl">
          <section className="gallery-panel mb-6 rounded-[2rem] border border-white/60 bg-white/30 p-5 shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl sm:p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-full border border-white/55 bg-white/38 px-4 py-2 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48"
                >
                  Back
                </button>
                <div className="relative flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.34),rgba(192,132,252,0.22),transparent_72%)] blur-2xl"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.36),rgba(249,168,212,0.16),transparent_70%)] blur-xl"
                  />
                  {[
                    { top: "8%", left: "24%", size: "8px", delay: "0s" },
                    { top: "24%", left: "86%", size: "7px", delay: "0.9s" },
                    { top: "74%", left: "16%", size: "6px", delay: "1.4s" },
                    { top: "82%", left: "72%", size: "7px", delay: "2.1s" },
                    { top: "42%", left: "92%", size: "5px", delay: "2.8s" },
                    { top: "18%", left: "6%", size: "5px", delay: "1.7s" },
                  ].map((sparkle, index) => (
                    <div
                      key={index}
                      aria-hidden="true"
                      className="absolute rounded-full"
                      style={{
                        top: sparkle.top,
                        left: sparkle.left,
                        width: sparkle.size,
                        height: sparkle.size,
                        background:
                          index % 2 === 0
                            ? "rgba(255,255,255,0.92)"
                            : "rgba(249,168,212,0.92)",
                        boxShadow:
                          index % 2 === 0
                            ? "0 0 14px rgba(255,255,255,0.8)"
                            : "0 0 14px rgba(249,168,212,0.75)",
                        animation: `butterflySparkle 3.6s ease-in-out infinite ${sparkle.delay}`,
                      }}
                    />
                  ))}
                  <img
                    src={logo}
                    alt="AuraFit AI logo"
                    className="relative z-10 h-40 w-40 object-contain drop-shadow-[0_0_42px_rgba(192,132,252,0.58)] sm:h-48 sm:w-48"
                    style={{ animation: "butterflyLift 5.5s ease-in-out infinite" }}
                  />
                </div>

                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#6D28D9]">
                    AuraFit AI
                  </p>
                  <h1 className="gallery-title mt-2 bg-gradient-to-r from-[#2E1065] via-[#6D28D9] to-[#F472B6] bg-clip-text text-3xl font-bold tracking-[-0.04em] text-transparent sm:text-4xl">
                    My Wardrobe
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4C1D95]/82 sm:text-base">
                    Manage and organize your clothing collection
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <label className="group flex items-center gap-3 rounded-full border border-white/55 bg-white/38 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5 text-[#7C3AED]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by item, category or color"
                    className="w-full bg-transparent text-sm font-medium text-[#4C1D95] outline-none placeholder:text-[#7C3AED]/60"
                  />
                </label>

                <button
                  type="button"
                  className="rounded-full border border-white/55 bg-white/38 px-5 py-3 text-sm font-semibold text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] backdrop-blur-md transition hover:bg-white/48"
                >
                  Filter
                </button>

                <button
                   type="button"
                   onClick={() => navigate("/add-item")}
                   className="rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.34)] transition duration-300 hover:scale-[1.01]"
                   >
                Add Item
               </button>
              </div>
            </div>
          </section>

          <section className="gallery-panel mb-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Items", value: items.length },
              { label: "Categories", value: uniqueCategories },
              { label: "Recently Added", value: recentlyAdded },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.7rem] border border-white/55 bg-white/32 p-5 shadow-[0_16px_34px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-2xl"
              >
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#6D28D9]">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-bold tracking-[-0.05em] text-[#2E1065]">
                  {stat.value}
                </p>
              </div>
            ))}
          </section>

          <section className="gallery-panel mb-6 rounded-[2rem] border border-white/55 bg-white/30 p-4 shadow-[0_14px_36px_rgba(91,33,182,0.12),inset_0_1px_0_rgba(255,255,255,0.74)] backdrop-blur-2xl">
            <div className="flex flex-wrap gap-3">
              {wardrobeCategories.map((category) => {
                const isSelected = category === selectedCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] text-white shadow-[0_12px_28px_rgba(124,58,237,0.3)]"
                        : "border border-white/55 bg-white/38 text-[#6D28D9] shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] hover:bg-white/48"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </section>

          {filteredItems.length === 0 ? (
            <section className="gallery-panel rounded-[2rem] border border-white/60 bg-white/30 p-8 text-center shadow-[0_16px_48px_rgba(91,33,182,0.16),inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-3xl">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8),rgba(249,168,212,0.28),rgba(192,132,252,0.18),transparent_72%)]">
                <svg
                  viewBox="0 0 24 24"
                  className="h-12 w-12 text-[#7C3AED]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M6 7h12l-1 12H7L6 7Z" />
                  <path d="M9 7V6a3 3 0 0 1 6 0v1" />
                </svg>
              </div>
              <h2 className="mt-6 text-3xl font-bold tracking-[-0.04em] text-[#2E1065]">
                Your wardrobe is empty
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#4C1D95]/80 sm:text-base">
                Try adjusting your search or filters, or start curating your
                digital closet from scratch.
              </p>
              <button
                type="button"
                className="mt-6 rounded-full bg-gradient-to-r from-[#6D28D9] via-[#9333EA] to-[#F472B6] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(124,58,237,0.34)] transition duration-300 hover:scale-[1.01]"
              >
                Add Your First Item
              </button>
            </section>
          ) : (
            <section className="gallery-panel grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <ClothingCard
                  key={item._id}
                  item={item}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </section>
          )}
        </main>
      </div>

      {selectedItem !== null && (
        <ViewItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}

export default WardrobeGallery;