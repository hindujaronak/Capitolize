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
      title: "Blog Posts",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/blog-posts",
    },
    {
      title: "Login",
      htmlBefore: '<i class="material-icons">error</i>',
      to: "/login",
    },
    {
      title: "Register",
      htmlBefore: '<i class="material-icons">error</i>',
      to: "/register",
    }
  ];
}
