import { App } from "vue";
// 引入全部样式
import "vant/lib/index.less";
// import "@vant/touch-emulator"; // 桌面端touch适配
import {
  Loading,
  ActionSheet,
  Empty,
  Row,
  Col,
  DatetimePicker,
  Tabs,
  Tab,
  Tag,
  Button,
  Badge,
  List,
  Calendar,
  CellGroup,
  Cell,
  CheckboxGroup,
  Checkbox,
  CountDown,
  Dialog,
  RadioGroup,
  Radio,
  Popover,
  Tabbar,
  TabbarItem,
  Toast,
  Switch,
  Swipe,
  SwipeItem,
  Search,
  Steps,
  Step,
  Grid,
  GridItem,
  NavBar,
  Icon,
  Sticky,
  Card,
  Sidebar,
  SidebarItem,
  Field,
  Form,
  Image,
  IndexBar,
  IndexAnchor
} from "vant";

const plugins = [
  Loading,
  ActionSheet,
  Empty,
  Row,
  Col,
  DatetimePicker,
  Tabs,
  Tab,
  Tag,
  Button,
  Badge,
  List,
  Calendar,
  CellGroup,
  Cell,
  CheckboxGroup,
  Checkbox,
  CountDown,
  RadioGroup,
  Radio,
  Popover,
  Tabbar,
  TabbarItem,
  Switch,
  Swipe,
  SwipeItem,
  Search,
  Steps,
  Step,
  Grid,
  GridItem,
  NavBar,
  Icon,
  Sticky,
  Card,
  Sidebar,
  SidebarItem,
  Field,
  Form,
  Image,
  IndexBar,
  IndexAnchor
];

export const vantPlugins = {
  install: function(app: App) {
    plugins.forEach(item => {
      app.component(item.name, item);
      // app.use(item)
    });
    app.use(Dialog);
    app.use(Toast);
  }
};
