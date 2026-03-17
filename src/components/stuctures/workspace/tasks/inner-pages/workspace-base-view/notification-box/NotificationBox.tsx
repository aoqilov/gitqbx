import AccordionNotification from "@/components/ui/accordion/AccordionNotification";

const NotificationBox = () => {
  // --------------------------------------- HOOKS

  // --------------------------------------- STATES
  const accordionItems = [
    {
      id: 1,
      title: "All notifications",
      content: "No notifications yet",
    },
    {
      id: 2,
      title: "All notifications",
      content: "No notifications yet",
    },
  ];
  // --------------------------------------- QUERIES

  // --------------------------------------- FUNCTIONS
  return (
    <div className="w-full! px-0.5!">
      <AccordionNotification items={accordionItems} />
    </div>
  );
};

export default NotificationBox;
