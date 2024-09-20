import React, { useEffect } from "react";
import { Button, Input, Textarea } from "@material-tailwind/react";

const ContactUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section className="flex justify-center items-center  px-4 py-8 lg:py-16">
      <div className="w-full max-w-4xl mx-auto text-center">
        <p className="mb-4 text-base lg:text-2xl text-blue-gray-600">
          Customer Care
        </p>
        <h1 className="mb-4 text-3xl lg:text-5xl text-blue-gray-900">
          We&apos;re Here to Help
        </h1>
        <p className="mb-10 lg:mb-20 max-w-3xl mx-auto text-lg text-gray-500">
          Whether it&apos;s a question about our services, a request for
          technical assistance, or suggestions for improvement, our team is
          eager to hear from you.
        </p>

        <div className="flex justify-center">
          <form className="flex flex-col gap-4 w-full max-w-lg mx-auto">
            <p className="text-left font-semibold text-gray-600">
              Select Options for Business Engagement
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Input for First Name */}
              <Input
                type="text"
                id="firstName"
                name="firstName"
                variant="outlined"
                label="First Name"
                size="lg"
                placeholder="Enter your first name"
                required
              />
              {/* Input for Email */}
              <Input
                type="email"
                id="email"
                name="email"
                variant="outlined"
                label="Email"
                size="lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <p className="mb-2 text-left font-medium text-gray-900">
                Your Message
              </p>
              <Textarea
                name="message"
                id="message"
                rows="3"
                className="w-full px-4 py-2"
                variant="outlined"
                label="Share your questions or suggestions with us 🙂"
                size="lg"
                required
              />
            </div>

            <Button className="w-full" color="gray">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
