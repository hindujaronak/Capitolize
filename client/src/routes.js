import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, NewLayout } from "./layouts/";

// Route Views
import BlogOverview from "./views/BlogOverview";
import UserProfileLite from "./views/UserProfileLite";
import AddNewPost from "./views/AddNewPost";
import Errors from "./views/Errors";
import ComponentsOverview from "./views/ComponentsOverview";
import Tables from "./views/Tables";
import BlogPosts from "./views/BlogPosts";
import Login from "./views/Login";
import Register from "./views/Register";
import Fundraiser from "./views/Fundraiser";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    component: () => <Redirect to="/login" />
  },
  {
    path: "/blog-overview",
    layout: NewLayout,
    component: BlogOverview
  },
  {
    path: "/user-profile-lite",
    layout: NewLayout,
    component: UserProfileLite
  },
  {
    path: "/add-new-idea",
    layout: NewLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors
  },
  {
    path: "/components-overview",
    layout: NewLayout,
    component: ComponentsOverview
  },
  {
    path: "/tables",
    layout: NewLayout,
    component: Tables
  },
  {
    path: "/all-fundraisers",
    layout: NewLayout,
    component: BlogPosts
  },
  {
    path: "/login",
    layout: DefaultLayout,
    component: Login
  },
  {
    path: "/register",
    layout: DefaultLayout,
    component: Register
  },
  {
    path: "/fundraiser/:id",
    layout: NewLayout,
    component: Fundraiser
  }
];
