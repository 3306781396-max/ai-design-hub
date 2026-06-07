import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
}

function BreadcrumbJsonLd({ items }: Props) {
  const itemList = [
    { "@type": "ListItem" as const, position: 1, name: "Home", item: "/" },
    ...items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 2,
      name: item.label,
      item: item.href || undefined,
    })),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: itemList,
        }),
      }}
    />
  );
}

export function Breadcrumb({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-dark-400">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary-400 transition-colors"
            >
              <span className="hidden sm:inline">Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1">
              <span className="text-dark-600 shrink-0">/</span>
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-primary-400 transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-dark-200 font-medium truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
