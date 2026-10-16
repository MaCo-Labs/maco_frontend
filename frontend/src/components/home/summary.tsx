import { Link } from "@tanstack/react-router";
import { products, type Brand, type Media } from "@/content/maco";
import { LineReveal } from "@/components/motion/line-reveal";
import { ProductVideo } from "@/components/media/product-video";
import { MorphSlider } from "@/components/media/morph-slider";
import { PhoneMockup } from "@/components/media/phone-mockup";
import { BridgeTour } from "@/components/products/bridge-tour";
import { WorkCollection } from "@/components/work/work-collection";

export function CardMedia({
  media,
  brand,
  gallery,
  screen,
  title,
  aspect = "2.1 / 1",
  className = "",
}: {
  media?: Media | undefined;
  brand?: Brand | undefined;
  gallery?: string[] | undefined;
  /** A looping screen recording for a phone-only product — rendered inside
   *  a phone-frame mockup instead of every other media type's flat card
   *  box, since a device screenshot doesn't read as "this is a phone app"
   *  boxed into a landscape panel. Takes priority over `gallery`/`media`. */
  screen?: Media | undefined;
  title: string;
  aspect?: string;
  className?: string;
}) {
  // Phone mockup bypasses the flat card box entirely — no fixed
  // aspect-ratio panel, no surface fill, no clip radius. The device is its
  // own shape; boxing it in a landscape card panel (like the other media
  // types below) just added dead grey space above and below it.
  if (screen) {
    return <PhoneMockup screen={screen} className={className} />;
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspect,
        borderRadius: "var(--radius-card)",
        background: "var(--surface-2)",
      }}
    >
      {gallery && gallery.length > 1 ? (
        // Radius 0: the CardMedia wrapper above already clips + rounds this
        // box (var(--radius-card)); a second radius here would just double
        // up at the same corners, so the slider fills it edge-to-edge.
        <MorphSlider items={gallery.map((src) => ({ image: src }))} radius={0} autoplay loop />
      ) : media ? (
        <ProductVideo
          media={media}
          objectFit={media.note ? "contain" : "cover"}
          radius="var(--radius-card)"
          priority="low"
        />
      ) : brand ? (
        <div className="absolute inset-0 grid place-items-center p-12">
          <img
            src={brand.src}
            alt=""
            width={brand.width}
            height={brand.height}
            loading="lazy"
            decoding="async"
            className="max-h-32 w-auto max-w-full object-contain"
          />
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center p-12">
          <span className="display-md text-center" style={{ color: "var(--muted)" }}>
            {title}
          </span>
        </div>
      )}
    </div>
  );
}

export function FeaturedWork() {
  return (
    <section data-ground="paper" aria-label="Selected client work">
      <div className="shell cb-section">
        <div className="work-chapter-heading">
          <div>
            <p className="label">Selected work</p>
            <LineReveal as="h2" className="display-lg mt-4 max-w-3xl">
              Different businesses.
              <br />
              Built around each one.
            </LineReveal>
          </div>
          <Link to="/work" className="btn-line">
            Explore all work <span aria-hidden="true">→</span>
          </Link>
        </div>
        <WorkCollection />
      </div>
    </section>
  );
}

export function ProductSummary() {
  const bridge = products.find((product) => product.slug === "bridge")!;
  const diary = products.find((product) => product.slug === "drivers-diary")!;
  return (
    <section data-ground="paper" aria-label="Products">
      <div className="shell cb-section">
        <div className="product-chapter">
          <div>
            <p className="product-ownership">A product by MaCo</p>
            <LineReveal as="h2" className="product-chapter-title">
              Bridge.
              <br />
              Bring it together.
            </LineReveal>
            <p className="product-chapter-copy">{bridge.short_description}</p>
            <div className="product-chapter-links">
              <Link to="/products/$slug" params={{ slug: bridge.slug }} className="btn-solid">
                Explore Bridge <span aria-hidden="true">↗</span>
              </Link>
              <a
                href={bridge.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-line"
              >
                Open workspace
              </a>
            </div>
          </div>
          <BridgeTour compact />
        </div>
        <div className="product-diary">
          <div className="product-diary-copy">
            <p className="product-ownership">Built for HeadGreen</p>
            <h3>
              Driver's Diary.
              <br />A fleet's working record.
            </h3>
            <p>
              Ride records, charging expenses, attendance and reports. One installable platform for
              the people keeping a fleet moving.
            </p>
            <Link to="/products/$slug" params={{ slug: diary.slug }} className="btn-line">
              Meet Driver's Diary <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="product-diary-visual">
            <CardMedia
              screen={diary.screen}
              media={diary.media}
              brand={diary.brand}
              title={diary.title}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
