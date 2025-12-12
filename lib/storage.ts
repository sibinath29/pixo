// IndexedDB storage utility for products (supports much larger storage than localStorage)

const DB_NAME = "pixo-db";
const DB_VERSION = 1;
const STORE_NAME = "products";

let db: IDBDatabase | null = null;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open database"));
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "slug" });
      }
    };
  });
}

export async function saveProducts(products: any[]): Promise<void> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing products
    store.clear();

    // Add all products
    products.forEach((product) => {
      store.add(product);
    });

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(new Error("Failed to save products"));
    };
  });
}

export async function getProducts(): Promise<any[]> {
  const database = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = () => {
      reject(new Error("Failed to get products"));
    };
  });
}

export async function addProduct(product: any): Promise<void> {
  const products = await getProducts();
  products.push(product);
  await saveProducts(products);
}

export async function deleteProduct(slug: string): Promise<void> {
  const products = await getProducts();
  const filtered = products.filter((p) => p.slug !== slug);
  await saveProducts(filtered);
}

export async function getStorageSize(): Promise<{ sizeInMB: string; sizeInBytes: number }> {
  try {
    const products = await getProducts();
    const jsonString = JSON.stringify(products);
    const sizeInBytes = new Blob([jsonString]).size;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return { sizeInBytes, sizeInMB };
  } catch (error) {
    return { sizeInBytes: 0, sizeInMB: "0.00" };
  }
}

// Migrate products from localStorage to IndexedDB (one-time migration)
export async function migrateFromLocalStorage(): Promise<void> {
  if (typeof window === "undefined") return;
  
  try {
    const localStorageProducts = localStorage.getItem("pixo-custom-products");
    if (localStorageProducts) {
      const products = JSON.parse(localStorageProducts);
      if (Array.isArray(products) && products.length > 0) {
        // Check if IndexedDB already has products
        const existingProducts = await getProducts();
        if (existingProducts.length === 0) {
          // Only migrate if IndexedDB is empty
          await saveProducts(products);
          console.log(`Migrated ${products.length} products from localStorage to IndexedDB`);
        }
        // Clear localStorage after migration
        localStorage.removeItem("pixo-custom-products");
      }
    }
  } catch (error) {
    console.error("Error migrating from localStorage:", error);
  }
}

