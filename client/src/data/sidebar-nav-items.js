export default function() {
  return [
    {
      title: "Dashboard",
      to: "/blog-overview",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "Add New Idea",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/add-new-idea",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/user-profile-lite",
    },
    {
      title: "Fundraisers",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/all-fundraisers",
    }
  ];
}
