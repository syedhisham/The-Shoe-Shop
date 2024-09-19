import { Typography, Card, CardBody } from "@material-tailwind/react";

function ContentCard({ img, title, desc }) {
  return (
    <Card className="relative grid min-h-[20rem] lg:min-h-[30rem] items-end overflow-hidden rounded-xl">
      <img
        src={img}
        alt="bg"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/70" />
      <CardBody className="relative flex flex-col justify-end p-6">
        <h2 className="text-white text-xl lg:text-2xl font-semibold">
          {title}
        </h2>
        <p className="my-2 text-sm lg:text-base font-normal text-white">
          {desc}
        </p>
      </CardBody>
    </Card>
  );
}

const contents = [
  {
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Search and Discovery",
    desc: "Website visitors today demand a frictionless user experience — especially when using search. Because of the high standards we tend to offer.",
  },
  {
    img: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Discover Our Latest Styles",
    desc: "Fashion is a modern form of self-expression. True style elevates your confidence, while trends come and go. Real elegance is timeless.",
  },
  {
    img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Flourish in Style",
    desc: "True style comes from the freedom to choose. Embrace the freedom to stand out—because uniformity never leads to greatness.",
  },
];

const BlogSection = () => {
  return (
    <section className=" container mx-auto w-full px-4 py-10 lg:py-20">
      <div className="mb-8 lg:mb-16">
        <h1 className="text-3xl lg:text-5xl font-bold">
          Build Something Great
        </h1>
        <p className="mt-4 text-sm lg:text-lg max-w-xl text-gray-500">
          We’re dedicated to bringing your fashion aspirations to life, offering
          you the opportunity to express your style and elevate your wardrobe.
          Every piece we deliver is crafted to help you embrace every moment
          with confidence and flair.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {contents.map(({ img, title, desc }) => (
          <ContentCard key={title} img={img} title={title} desc={desc} />
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
