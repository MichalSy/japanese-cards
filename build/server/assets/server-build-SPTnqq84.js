import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, Meta, Links, ScrollRestoration, Scripts, useNavigate, useLocation, useLoaderData, useParams, useSearchParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createContext, useContext, useState, lazy, Suspense } from "react";
import { Globe } from "lucide-react";
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");
    const readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, 5e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const LanguageContext = createContext();
function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("language") || "de";
    } catch {
      return "de";
    }
  });
  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLanguage = prev === "de" ? "en" : "de";
      try {
        localStorage.setItem("language", newLanguage);
      } catch (e) {
        console.error("Failed to save language:", e);
      }
      return newLanguage;
    });
  };
  return /* @__PURE__ */ jsx(LanguageContext.Provider, { value: { language, toggleLanguage }, children });
}
function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover"
      }), /* @__PURE__ */ jsx("meta", {
        name: "apple-mobile-web-app-capable",
        content: "yes"
      }), /* @__PURE__ */ jsx("meta", {
        name: "apple-mobile-web-app-status-bar-style",
        content: "black-translucent"
      }), /* @__PURE__ */ jsx("meta", {
        name: "apple-mobile-web-app-title",
        content: "Japanese Cards"
      }), /* @__PURE__ */ jsx("meta", {
        name: "theme-color",
        content: "#1e293b"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        type: "image/png",
        href: "/japanese-cards/favicon.png"
      }), /* @__PURE__ */ jsx("link", {
        rel: "preconnect",
        href: "https://fonts.googleapis.com"
      }), /* @__PURE__ */ jsx("link", {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous"
      }), /* @__PURE__ */ jsx("link", {
        href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap",
        rel: "stylesheet"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(LanguageProvider, {
        children
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const API_CONFIG = {
  BASE_URL: "https://raw.githubusercontent.com/MichalSy/japanese-cards/refs/heads/main/public/GameData"
};
const buildUrl = (path) => {
  return `${API_CONFIG.BASE_URL}/${path}`;
};
const fetchCategories = async () => {
  try {
    const response = await fetch(buildUrl("categories.json"));
    if (!response.ok) throw new Error("Failed to fetch categories");
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
const fetchCategoryConfig = async (categoryId) => {
  try {
    const response = await fetch(buildUrl(`${categoryId}/category.json`));
    if (!response.ok) throw new Error(`Failed to fetch ${categoryId} config`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category config for ${categoryId}:`, error);
    throw error;
  }
};
const fetchGroupData = async (categoryId, groupId) => {
  try {
    const response = await fetch(buildUrl(`${categoryId}/data/${categoryId}-${groupId}.json`));
    if (!response.ok) throw new Error(`Failed to fetch group data`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching group data for ${categoryId}/${groupId}:`, error);
    throw error;
  }
};
const fetchGameModes = async () => {
  try {
    const response = await fetch(buildUrl("gamemodes.json"));
    if (!response.ok) throw new Error("Failed to fetch game modes");
    return await response.json();
  } catch (error) {
    console.error("Error fetching game modes:", error);
    throw error;
  }
};
const fetchAllItemsFromCategory = async (categoryId) => {
  try {
    const config = await fetchCategoryConfig(categoryId);
    const itemPromises = config.groups.map(
      (group) => fetchGroupData(categoryId, group.id)
    );
    const groupsData = await Promise.all(itemPromises);
    const allItems = groupsData.reduce((acc, groupData) => {
      return [...acc, ...groupData.items || []];
    }, []);
    return {
      id: `${categoryId}-all`,
      name: `${config.name} - Alle kombiniert`,
      type: config.type,
      items: allItems
    };
  } catch (error) {
    console.error(`Error fetching all items for ${categoryId}:`, error);
    throw error;
  }
};
function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "var(--spacing-2)" }, children: [
    /* @__PURE__ */ jsx(Globe, { size: 18, style: { color: "var(--color-text-primary)" } }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleLanguage,
        style: {
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px",
          backgroundColor: "var(--color-surface-light)",
          border: "none",
          borderRadius: "20px",
          cursor: "pointer",
          transition: "all 0.3s ease"
        },
        children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                color: language === "de" ? "white" : "var(--color-text-tertiary)",
                backgroundColor: language === "de" ? "var(--color-primary)" : "transparent"
              },
              children: "DE"
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                padding: "6px 12px",
                borderRadius: "16px",
                fontSize: "12px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                color: language === "en" ? "white" : "var(--color-text-tertiary)",
                backgroundColor: language === "en" ? "var(--color-primary)" : "transparent"
              },
              children: "EN"
            }
          )
        ]
      }
    )
  ] });
}
function AppHeaderBar({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    width: "100%",
    gap: "var(--spacing-2)"
  }, children: [
    /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "5px 0" }, children: !isHome && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => navigate(-1),
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          color: "var(--color-text-primary)",
          fontSize: "27px",
          cursor: "pointer",
          border: "none",
          borderRadius: "50%",
          transition: "all 0.2s",
          backgroundColor: "transparent",
          lineHeight: 1,
          padding: "0 0 5px 0"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--color-surface-light)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        },
        children: "←"
      }
    ) }),
    /* @__PURE__ */ jsx("h1", { className: "text-lg font-bold", style: {
      color: "var(--color-text-primary)",
      margin: 0,
      textAlign: "left"
    }, children: title || "Japanese Cards" }),
    /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", justifyContent: "flex-end" }, children: /* @__PURE__ */ jsx(LanguageToggle, {}) })
  ] });
}
function AppLayout({ children }) {
  return /* @__PURE__ */ jsx("div", { style: {
    position: "fixed",
    inset: 0,
    backgroundColor: "var(--color-bg-primary)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "var(--font-family)"
  }, children });
}
function AppHeader({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "header", style: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }, children });
}
function AppContent({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "content", children });
}
function AppFooter({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "footer", children });
}
function Card({ children, interactive, onClick }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      onClick,
      className: `card ${interactive ? "card-interactive" : ""}`,
      style: {
        cursor: interactive ? "pointer" : "default"
      },
      onMouseDown: (e) => interactive && (e.currentTarget.style.transform = "scale(0.98)"),
      onMouseUp: (e) => interactive && (e.currentTarget.style.transform = "scale(1)"),
      children
    }
  );
}
async function loader$2() {
  const data = await fetchCategories();
  return {
    categories: data.categories.filter((cat) => cat.enabled !== false)
  };
}
function meta$3() {
  return [{
    title: "Japanese Cards"
  }, {
    name: "description",
    content: "Learn Japanese scripts playfully."
  }];
}
const MainMenu = UNSAFE_withComponentProps(function MainMenu2() {
  const navigate = useNavigate();
  const {
    categories
  } = useLoaderData();
  const {
    language
  } = useLanguage();
  const [activeTab, setActiveTab] = useState("start");
  const tabs = [{
    id: "start",
    labelDe: "Start",
    labelEn: "Start",
    icon: "🎮"
  }, {
    id: "progress",
    labelDe: "Fortschritt",
    labelEn: "Progress",
    icon: "📊"
  }, {
    id: "stats",
    labelDe: "Statistiken",
    labelEn: "Stats",
    icon: "🏆"
  }];
  const getLabel = (obj, key) => {
    const fieldKey = language === "de" ? `${key}De` : `${key}En`;
    return obj[fieldKey] || obj[key];
  };
  const getCategoryName = (category) => {
    return getLabel(category, "name") || category.name;
  };
  const getCategoryDescription = (category) => {
    return getLabel(category, "description");
  };
  return /* @__PURE__ */ jsxs(AppLayout, {
    children: [/* @__PURE__ */ jsx(AppHeader, {
      children: /* @__PURE__ */ jsx(AppHeaderBar, {})
    }), /* @__PURE__ */ jsxs(AppContent, {
      children: [activeTab === "start" && /* @__PURE__ */ jsxs("div", {
        className: "space-y-6",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-base font-medium text-primary",
          children: language === "de" ? "Kategorien" : "Categories"
        }), /* @__PURE__ */ jsx("div", {
          className: "grid-1 fade-in",
          children: categories.map((type) => /* @__PURE__ */ jsx(Card, {
            interactive: true,
            onClick: () => navigate(`/content/${type.id}`),
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-4)"
              },
              children: [/* @__PURE__ */ jsx("div", {
                style: {
                  width: "60px",
                  height: "60px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--color-surface-light)",
                  borderRadius: "50%",
                  flexShrink: 0,
                  fontSize: "32px"
                },
                children: type.emoji
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  flex: 1,
                  textAlign: "left"
                },
                children: [/* @__PURE__ */ jsx("h3", {
                  className: "text-base font-medium",
                  style: {
                    color: "var(--color-text-primary)",
                    margin: 0
                  },
                  children: getCategoryName(type)
                }), getCategoryDescription(type) && /* @__PURE__ */ jsx("p", {
                  className: "text-sm",
                  style: {
                    color: "var(--color-text-tertiary)",
                    margin: "var(--spacing-1) 0 0 0"
                  },
                  children: getCategoryDescription(type)
                })]
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  color: "var(--color-text-tertiary)",
                  fontSize: "20px"
                },
                children: "→"
              })]
            })
          }, type.id))
        })]
      }), activeTab === "progress" && /* @__PURE__ */ jsxs("div", {
        className: "space-y-6",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-base font-medium text-primary",
          children: language === "de" ? "Dein Fortschritt" : "Your Progress"
        }), /* @__PURE__ */ jsx("div", {
          className: "grid-1",
          children: categories.map((type) => /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-2)"
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                },
                children: [/* @__PURE__ */ jsx("span", {
                  className: "text-sm font-medium text-primary",
                  children: getCategoryName(type)
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--color-primary)"
                  },
                  children: "42%"
                })]
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  width: "100%",
                  backgroundColor: "var(--color-surface-light)",
                  borderRadius: "9999px",
                  height: "8px"
                },
                children: /* @__PURE__ */ jsx("div", {
                  style: {
                    background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                    height: "8px",
                    borderRadius: "9999px",
                    width: "42%"
                  }
                })
              })]
            })
          }, type.id))
        })]
      }), activeTab === "stats" && /* @__PURE__ */ jsxs("div", {
        className: "space-y-6",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-base font-medium text-primary",
          children: language === "de" ? "Statistiken" : "Statistics"
        }), /* @__PURE__ */ jsxs("div", {
          className: "grid-2",
          children: [/* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center"
              },
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-tertiary",
                style: {
                  margin: "0 0 var(--spacing-2) 0"
                },
                children: language === "de" ? "Tage aktiv" : "Days active"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-3xl font-bold",
                style: {
                  color: "var(--color-primary)",
                  margin: 0
                },
                children: "12"
              })]
            })
          }), /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center"
              },
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-tertiary",
                style: {
                  margin: "0 0 var(--spacing-2) 0"
                },
                children: language === "de" ? "Punkte" : "Points"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-3xl font-bold",
                style: {
                  color: "var(--color-secondary)",
                  margin: 0
                },
                children: "1.2K"
              })]
            })
          }), /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center"
              },
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-tertiary",
                style: {
                  margin: "0 0 var(--spacing-2) 0"
                },
                children: language === "de" ? "Genauigkeit" : "Accuracy"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-3xl font-bold",
                style: {
                  color: "#3b82f6",
                  margin: 0
                },
                children: "89%"
              })]
            })
          }), /* @__PURE__ */ jsx(Card, {
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                textAlign: "center"
              },
              children: [/* @__PURE__ */ jsx("p", {
                className: "text-sm text-tertiary",
                style: {
                  margin: "0 0 var(--spacing-2) 0"
                },
                children: language === "de" ? "Streak" : "Streak"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-3xl font-bold",
                style: {
                  color: "#10b981",
                  margin: 0
                },
                children: "7"
              })]
            })
          })]
        })]
      })]
    }), /* @__PURE__ */ jsx(AppFooter, {
      children: /* @__PURE__ */ jsx("div", {
        style: {
          width: "100%",
          display: "flex",
          gap: 0,
          height: "100%",
          alignItems: "stretch"
        },
        children: tabs.map((tab) => {
          const label = language === "de" ? tab.labelDe : tab.labelEn;
          return /* @__PURE__ */ jsxs("button", {
            onClick: () => setActiveTab(tab.id),
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--spacing-1)",
              padding: "0",
              borderRadius: "var(--radius-md)",
              transition: "all 0.2s",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === tab.id ? `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` : "transparent",
              background: activeTab === tab.id ? `linear-gradient(135deg, var(--color-primary), var(--color-secondary))` : "transparent",
              color: activeTab === tab.id ? "white" : "var(--color-text-tertiary)"
            },
            children: [/* @__PURE__ */ jsx("span", {
              style: {
                fontSize: "24px"
              },
              children: tab.icon
            }), /* @__PURE__ */ jsx("span", {
              className: "text-sm font-medium",
              children: label
            })]
          }, tab.id);
        })
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MainMenu,
  loader: loader$2,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1({
  params
}) {
  const {
    contentType
  } = params;
  const categoryConfig = await fetchCategoryConfig(contentType);
  return {
    categoryConfig,
    contentType
  };
}
function meta$2({
  data
}) {
  if (!data) return [{
    title: "Japanese Cards"
  }];
  const {
    categoryConfig
  } = data;
  return [{
    title: `${categoryConfig.name} - Japanese Cards`
  }];
}
const ContentTypeView = UNSAFE_withComponentProps(function ContentTypeView2() {
  const {
    categoryConfig,
    contentType
  } = useLoaderData();
  const navigate = useNavigate();
  const {
    language
  } = useLanguage();
  const getLabel = (obj, key) => {
    if (!obj) return "";
    const fieldKey = language === "de" ? `${key}De` : `${key}En`;
    return obj[fieldKey] || obj[key] || "";
  };
  const categoryName = getLabel(categoryConfig, "name") || categoryConfig.name;
  return /* @__PURE__ */ jsxs(AppLayout, {
    children: [/* @__PURE__ */ jsx(AppHeader, {
      children: /* @__PURE__ */ jsx(AppHeaderBar, {
        title: categoryName
      })
    }), /* @__PURE__ */ jsx(AppContent, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "space-y-6 fade-in",
        children: [categoryConfig.showAllOption && /* @__PURE__ */ jsx(Card, {
          interactive: true,
          onClick: () => navigate(`/content/${contentType}/all`),
          children: /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-3)"
            },
            children: [/* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              },
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("h3", {
                  className: "text-base font-medium",
                  style: {
                    color: "var(--color-text-primary)",
                    margin: 0
                  },
                  children: language === "de" ? "Alle kombiniert" : "All Combined"
                }), /* @__PURE__ */ jsxs("p", {
                  className: "text-sm text-tertiary",
                  style: {
                    margin: "var(--spacing-1) 0 0 0"
                  },
                  children: [categoryConfig.groups.length, " ", language === "de" ? "Gruppen" : "groups"]
                })]
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--color-primary)"
                },
                children: "0%"
              })]
            }), /* @__PURE__ */ jsx("div", {
              style: {
                width: "100%",
                backgroundColor: "var(--color-surface-light)",
                borderRadius: "9999px",
                height: "8px"
              },
              children: /* @__PURE__ */ jsx("div", {
                style: {
                  background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                  height: "8px",
                  borderRadius: "9999px",
                  width: "0%"
                }
              })
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "grid-1",
          children: categoryConfig.groups.map((group) => /* @__PURE__ */ jsx(Card, {
            interactive: true,
            onClick: () => navigate(`/content/${contentType}/${group.id}`),
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: "var(--spacing-3)"
              },
              children: [/* @__PURE__ */ jsxs("div", {
                style: {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start"
                },
                children: [/* @__PURE__ */ jsx("div", {
                  children: /* @__PURE__ */ jsx("h3", {
                    className: "text-base font-medium",
                    style: {
                      color: "var(--color-text-primary)",
                      margin: 0
                    },
                    children: group.name
                  })
                }), /* @__PURE__ */ jsx("span", {
                  style: {
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--color-primary)"
                  },
                  children: "0%"
                })]
              }), /* @__PURE__ */ jsx("div", {
                style: {
                  width: "100%",
                  backgroundColor: "var(--color-surface-light)",
                  borderRadius: "9999px",
                  height: "8px"
                },
                children: /* @__PURE__ */ jsx("div", {
                  style: {
                    background: `linear-gradient(to right, var(--color-primary), var(--color-secondary))`,
                    height: "8px",
                    borderRadius: "9999px",
                    width: "0%"
                  }
                })
              })]
            })
          }, group.id))
        })]
      })
    }), /* @__PURE__ */ jsx(AppFooter, {
      children: /* @__PURE__ */ jsxs("button", {
        onClick: () => navigate(`/content/${contentType}/${categoryConfig.groups[0].id}`),
        style: {
          flex: 1,
          padding: "var(--spacing-3) var(--spacing-4)",
          backgroundColor: "var(--color-primary)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-md)",
          fontWeight: "600",
          cursor: "pointer",
          fontSize: "16px",
          transition: "all 0.2s"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary)";
        },
        children: [language === "de" ? "Spielen" : "Play", " →"]
      })
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ContentTypeView,
  loader: loader$1,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  params
}) {
  const {
    contentType,
    groupId
  } = params;
  const [categoryConfig, gameModeConfig] = await Promise.all([fetchCategoryConfig(contentType), fetchGameModes()]);
  return {
    categoryConfig,
    gameModeConfig,
    contentType,
    groupId
  };
}
function meta$1({
  data
}) {
  if (!data) return [{
    title: "Japanese Cards"
  }];
  const {
    categoryConfig,
    groupId
  } = data;
  const groupName = categoryConfig?.groups?.find((g) => g.id === groupId)?.name || "Gruppe";
  return [{
    title: `${categoryConfig.name} - ${groupName} - Japanese Cards`
  }];
}
const GameModeSelector = UNSAFE_withComponentProps(function GameModeSelector2() {
  const {
    categoryConfig,
    gameModeConfig,
    contentType,
    groupId
  } = useLoaderData();
  const navigate = useNavigate();
  const [cardCount, setCardCount] = useState(20);
  const gameModeMap = {};
  if (gameModeConfig?.gameModes) {
    gameModeConfig.gameModes.forEach((mode) => {
      gameModeMap[mode.id] = mode;
    });
  }
  const availableGameModes = categoryConfig?.gameModes || [];
  const gameModes = availableGameModes.map((modeId) => gameModeMap[modeId]).filter((mode) => mode && mode.enabled);
  const groupName = categoryConfig?.groups?.find((g) => g.id === groupId)?.name || "Gruppe";
  return /* @__PURE__ */ jsxs(AppLayout, {
    children: [/* @__PURE__ */ jsx(AppHeader, {
      children: /* @__PURE__ */ jsx(AppHeaderBar, {
        title: groupName
      })
    }), /* @__PURE__ */ jsx(AppContent, {
      children: /* @__PURE__ */ jsxs("div", {
        className: "space-y-6 fade-in",
        children: [/* @__PURE__ */ jsx("div", {
          style: {
            padding: "var(--spacing-3)",
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-surface-light)"
          },
          children: /* @__PURE__ */ jsxs("label", {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "var(--spacing-3)",
              color: "var(--color-text-primary)",
              fontWeight: "500"
            },
            children: [/* @__PURE__ */ jsx("span", {
              children: "Kartenanzahl:"
            }), /* @__PURE__ */ jsxs("select", {
              value: cardCount,
              onChange: (e) => setCardCount(e.target.value === "all" ? "all" : parseInt(e.target.value)),
              style: {
                padding: "var(--spacing-2) var(--spacing-3)",
                backgroundColor: "var(--color-surface-light)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-surface-dark)",
                borderRadius: "var(--radius-md)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer"
              },
              children: [/* @__PURE__ */ jsx("option", {
                value: "10",
                children: "10"
              }), /* @__PURE__ */ jsx("option", {
                value: "20",
                children: "20"
              }), /* @__PURE__ */ jsx("option", {
                value: "50",
                children: "50"
              }), /* @__PURE__ */ jsx("option", {
                value: "all",
                children: "Alle"
              })]
            })]
          })
        }), /* @__PURE__ */ jsx(Card, {
          children: /* @__PURE__ */ jsxs("div", {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: "var(--spacing-3)"
            },
            children: [/* @__PURE__ */ jsx("h3", {
              className: "text-sm font-medium text-primary",
              children: "Deine Statistik"
            }), /* @__PURE__ */ jsxs("div", {
              className: "grid-2",
              children: [/* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-sm text-tertiary",
                  style: {
                    margin: 0
                  },
                  children: "Korrekt"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-2xl font-bold",
                  style: {
                    color: "#10b981",
                    margin: 0
                  },
                  children: "14/15"
                })]
              }), /* @__PURE__ */ jsxs("div", {
                children: [/* @__PURE__ */ jsx("p", {
                  className: "text-sm text-tertiary",
                  style: {
                    margin: 0
                  },
                  children: "Genauigkeit"
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-2xl font-bold",
                  style: {
                    color: "#3b82f6",
                    margin: 0
                  },
                  children: "93%"
                })]
              })]
            })]
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "grid-1",
          children: gameModes.map((mode) => /* @__PURE__ */ jsx(Card, {
            interactive: true,
            onClick: () => navigate(`/game/${contentType}/${groupId}/${mode.id}?cards=${cardCount}`),
            children: /* @__PURE__ */ jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-4)"
              },
              children: [/* @__PURE__ */ jsx("span", {
                style: {
                  fontSize: "32px",
                  flexShrink: 0
                },
                children: mode.emoji
              }), /* @__PURE__ */ jsxs("div", {
                style: {
                  flex: 1,
                  textAlign: "left"
                },
                children: [/* @__PURE__ */ jsx("h3", {
                  className: "text-base font-medium",
                  style: {
                    color: "var(--color-text-primary)",
                    margin: 0
                  },
                  children: mode.name
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-sm text-tertiary",
                  style: {
                    margin: "var(--spacing-1) 0 0 0"
                  },
                  children: mode.description
                })]
              }), /* @__PURE__ */ jsx("span", {
                style: {
                  color: "var(--color-text-tertiary)"
                },
                children: "→"
              })]
            })
          }, mode.id))
        })]
      })
    }), /* @__PURE__ */ jsx(AppFooter, {
      children: /* @__PURE__ */ jsx("p", {
        className: "text-sm text-tertiary",
        style: {
          width: "100%",
          textAlign: "center",
          margin: 0
        },
        children: "Wähle einen Modus zum Spielen"
      })
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GameModeSelector,
  loader,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const SwipeGame = lazy(() => import("./SwipeGame-CCgzrLMF.js"));
const GAME_MODES = {
  swipe: SwipeGame,
  multiChoice: null,
  // TODO
  flashcard: null,
  // TODO
  typing: null
  // TODO
};
const modeNames = {
  swipe: "Swipe Game",
  multiChoice: "Multiple Choice",
  flashcard: "Flashcard",
  typing: "Typing Challenge"
};
const modeEmojis = {
  swipe: "👆",
  multiChoice: "🎯",
  flashcard: "🃏",
  typing: "⌨️"
};
function meta({
  params
}) {
  const {
    modeId
  } = params;
  return [{
    title: `${modeNames[modeId] || "Game"} - Japanese Cards`
  }];
}
const GameScreen = UNSAFE_withComponentProps(function GameScreen2() {
  const {
    contentType,
    groupId,
    modeId
  } = useParams();
  const [searchParams] = useSearchParams();
  const cardCount = searchParams.get("cards") || 20;
  const GameComponent = GAME_MODES[modeId];
  if (!GameComponent) {
    return /* @__PURE__ */ jsxs(AppLayout, {
      children: [/* @__PURE__ */ jsx(AppHeader, {
        children: /* @__PURE__ */ jsx(AppHeaderBar, {
          title: modeNames[modeId] || "Unbekannter Modus"
        })
      }), /* @__PURE__ */ jsx(AppContent, {
        children: /* @__PURE__ */ jsx("div", {
          style: {
            padding: "var(--spacing-4)",
            backgroundColor: "#fee2e2",
            borderRadius: "var(--radius-md)",
            color: "#991b1b"
          },
          children: "Dieser Modus ist noch nicht verfügbar."
        })
      })]
    });
  }
  return /* @__PURE__ */ jsxs(AppLayout, {
    children: [/* @__PURE__ */ jsx(AppHeader, {
      children: /* @__PURE__ */ jsx(AppHeaderBar, {
        title: modeNames[modeId]
      })
    }), /* @__PURE__ */ jsx(Suspense, {
      fallback: /* @__PURE__ */ jsx(AppContent, {
        children: /* @__PURE__ */ jsx("div", {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%"
          },
          children: /* @__PURE__ */ jsxs("div", {
            style: {
              textAlign: "center"
            },
            children: [/* @__PURE__ */ jsx("div", {
              style: {
                fontSize: "60px",
                marginBottom: "var(--spacing-5)"
              },
              children: modeEmojis[modeId]
            }), /* @__PURE__ */ jsx("h2", {
              className: "text-2xl font-bold",
              style: {
                color: "var(--color-text-primary)",
                margin: "0 0 var(--spacing-2) 0"
              },
              children: "Wird geladen..."
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-base text-secondary",
              style: {
                margin: "0 0 var(--spacing-3) 0"
              },
              children: [modeNames[modeId], " wird vorbereitet"]
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-tertiary",
              style: {
                margin: 0
              },
              children: ["Karten: ", cardCount === "all" ? "Alle" : cardCount]
            })]
          })
        })
      }),
      children: /* @__PURE__ */ jsx(GameComponent, {
        contentType,
        groupId,
        cardCount
      })
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: GameScreen,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/japanese-cards/assets/entry.client-2zWQ-XP0.js", "imports": ["/japanese-cards/assets/chunk-JZWAC4HX-BOJ21O0C.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/japanese-cards/assets/root-pimIbd73.js", "imports": ["/japanese-cards/assets/chunk-JZWAC4HX-BOJ21O0C.js", "/japanese-cards/assets/LanguageContext-BTeNvZwJ.js"], "css": ["/japanese-cards/assets/root-DbmuvHzL.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/MainMenu": { "id": "pages/MainMenu", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/japanese-cards/assets/MainMenu-hvjdDELw.js", "imports": ["/japanese-cards/assets/chunk-JZWAC4HX-BOJ21O0C.js", "/japanese-cards/assets/LanguageContext-BTeNvZwJ.js", "/japanese-cards/assets/Layout-BNKjru07.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/ContentTypeView": { "id": "pages/ContentTypeView", "parentId": "root", "path": "content/:contentType", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/japanese-cards/assets/ContentTypeView-DzqDNTsz.js", "imports": ["/japanese-cards/assets/chunk-JZWAC4HX-BOJ21O0C.js", "/japanese-cards/assets/LanguageContext-BTeNvZwJ.js", "/japanese-cards/assets/Layout-BNKjru07.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/GameModeSelector": { "id": "pages/GameModeSelector", "parentId": "root", "path": "content/:contentType/:groupId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/japanese-cards/assets/GameModeSelector-DSUtDqK5.js", "imports": ["/japanese-cards/assets/chunk-JZWAC4HX-BOJ21O0C.js", "/japanese-cards/assets/Layout-BNKjru07.js", "/japanese-cards/assets/LanguageContext-BTeNvZwJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "pages/GameScreen": { "id": "pages/GameScreen", "parentId": "root", "path": "game/:contentType/:groupId/:modeId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/japanese-cards/assets/GameScreen-D8ZuZpTa.js", "imports": ["/japanese-cards/assets/chunk-JZWAC4HX-BOJ21O0C.js", "/japanese-cards/assets/Layout-BNKjru07.js", "/japanese-cards/assets/LanguageContext-BTeNvZwJ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/japanese-cards/assets/manifest-9f85eec2.js", "version": "9f85eec2", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = ["/", "/content/hiragana", "/content/hiragana/a", "/game/hiragana/a/swipe", "/content/hiragana/ka", "/game/hiragana/ka/swipe", "/content/hiragana/sa", "/game/hiragana/sa/swipe", "/content/hiragana/ta", "/game/hiragana/ta/swipe", "/content/hiragana/na", "/game/hiragana/na/swipe", "/content/hiragana/ha", "/game/hiragana/ha/swipe", "/content/hiragana/ma", "/game/hiragana/ma/swipe", "/content/hiragana/ya", "/game/hiragana/ya/swipe", "/content/hiragana/ra", "/game/hiragana/ra/swipe", "/content/hiragana/wa", "/game/hiragana/wa/swipe", "/content/hiragana/ga", "/game/hiragana/ga/swipe", "/content/hiragana/za", "/game/hiragana/za/swipe", "/content/hiragana/da", "/game/hiragana/da/swipe", "/content/hiragana/ba", "/game/hiragana/ba/swipe", "/content/hiragana/pa", "/game/hiragana/pa/swipe", "/content/hiragana/all", "/game/hiragana/all/swipe", "/content/katakana", "/content/katakana/a", "/game/katakana/a/swipe", "/content/katakana/ka", "/game/katakana/ka/swipe", "/content/katakana/sa", "/game/katakana/sa/swipe", "/content/katakana/ta", "/game/katakana/ta/swipe", "/content/katakana/na", "/game/katakana/na/swipe", "/content/katakana/ha", "/game/katakana/ha/swipe", "/content/katakana/ma", "/game/katakana/ma/swipe", "/content/katakana/ya", "/game/katakana/ya/swipe", "/content/katakana/ra", "/game/katakana/ra/swipe", "/content/katakana/wa", "/game/katakana/wa/swipe", "/content/katakana/all", "/game/katakana/all/swipe", "/content/words", "/content/words/all", "/content/words/all", "/content/sentences", "/content/sentences/all", "/content/sentences/all"];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/japanese-cards/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "pages/MainMenu": {
    id: "pages/MainMenu",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "pages/ContentTypeView": {
    id: "pages/ContentTypeView",
    parentId: "root",
    path: "content/:contentType",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "pages/GameModeSelector": {
    id: "pages/GameModeSelector",
    parentId: "root",
    path: "content/:contentType/:groupId",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "pages/GameScreen": {
    id: "pages/GameScreen",
    parentId: "root",
    path: "game/:contentType/:groupId/:modeId",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
const allowedActionOrigins = false;
export {
  AppContent as A,
  Card as C,
  AppFooter as a,
  fetchGroupData as b,
  allowedActionOrigins as c,
  assetsBuildDirectory as d,
  basename as e,
  fetchAllItemsFromCategory as f,
  entry as g,
  future as h,
  isSpaMode as i,
  publicPath as j,
  routes as k,
  ssr as l,
  prerender as p,
  routeDiscovery as r,
  serverManifest as s
};
