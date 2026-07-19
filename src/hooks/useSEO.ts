import { useEffect } from "react";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

const useSEO = ({
  title = "NEC Travels",
  description = "Best travel service in Bangladesh",
  image = "/assets/images/favicon.ico",
  url = window.location.href,
}: SEOProps) => {
  useEffect(() => {
    document.title = title ? `${title} | NEC Travels` : "NEC Travels";

    setMeta("description", description);

    setProperty("og:title", title);
    setProperty("og:description", description);
    setProperty("og:image", image);
    setProperty("og:url", url);
  }, [title, description, image, url]);
};

const setMeta = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const setProperty = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

export default useSEO;
