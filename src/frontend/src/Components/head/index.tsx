// import head as name headData
import HeadPage from "next/head";

export function Head({title, description, keywords, icon}: {title: string, description: string, keywords: string, icon: string}) {
  return (
    <>
      <HeadPage>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={icon} />
      </HeadPage>
    </>
  );
}