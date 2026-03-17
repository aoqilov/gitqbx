

type IconType =
  | "work"
  | "health"
  | "sport"
  | "science"
  | "nature"
  | "document"
  | "date"
  | "status"
  | "user"
  | "security"
  | "finance"
  | "communication"
  | "infrastructure"
  | "analytics";

export const iconList: {
  index: number;
  icon: string;
  iconType: IconType;
}[] = [
  // work
  { index: 0, icon: "FaBriefcase", iconType: "work" },
  { index: 1, icon: "MdWork", iconType: "work" },
  { index: 2, icon: "FaBuilding", iconType: "work" },
  { index: 3, icon: "FaTools", iconType: "work" },
  { index: 4, icon: "MdBusinessCenter", iconType: "work" },
  { index: 5, icon: "FaClipboardCheck", iconType: "work" },

  // health
  { index: 6, icon: "FaHeartbeat", iconType: "health" },
  { index: 7, icon: "FaHospital", iconType: "health" },
  { index: 8, icon: "FaFirstAid", iconType: "health" },
  { index: 9, icon: "FaNotesMedical", iconType: "health" },
  { index: 10, icon: "MdHealthAndSafety", iconType: "health" },
  { index: 11, icon: "FaUserMd", iconType: "health" },

  // sport
  { index: 12, icon: "FaFootballBall", iconType: "sport" },
  { index: 13, icon: "FaBasketballBall", iconType: "sport" },
  { index: 14, icon: "FaRunning", iconType: "sport" },
  { index: 15, icon: "MdSportsSoccer", iconType: "sport" },
  { index: 16, icon: "MdFitnessCenter", iconType: "sport" },
  { index: 17, icon: "FaDumbbell", iconType: "sport" },

  // science
  { index: 18, icon: "FaFlask", iconType: "science" },
  { index: 19, icon: "FaAtom", iconType: "science" },
  { index: 20, icon: "FaMicroscope", iconType: "science" },
  { index: 21, icon: "MdScience", iconType: "science" },
  { index: 22, icon: "FaVial", iconType: "science" },
  { index: 23, icon: "FaBrain", iconType: "science" },

  // nature
  { index: 24, icon: "FaLeaf", iconType: "nature" },
  { index: 25, icon: "FaSeedling", iconType: "nature" },
  { index: 26, icon: "FaTree", iconType: "nature" },
  { index: 27, icon: "MdEco", iconType: "nature" },
  { index: 28, icon: "FaMountain", iconType: "nature" },
  { index: 29, icon: "FaWater", iconType: "nature" },

  // document
  { index: 30, icon: "FaFileAlt", iconType: "document" },
  { index: 31, icon: "FaFolder", iconType: "document" },
  { index: 32, icon: "FaFolderOpen", iconType: "document" },
  { index: 33, icon: "MdDescription", iconType: "document" },
  { index: 34, icon: "FaArchive", iconType: "document" },
  { index: 35, icon: "FaFileSignature", iconType: "document" },

  // date
  { index: 36, icon: "FaCalendarAlt", iconType: "date" },
  { index: 37, icon: "FaClock", iconType: "date" },
  { index: 38, icon: "MdEvent", iconType: "date" },
  { index: 39, icon: "MdSchedule", iconType: "date" },
  { index: 40, icon: "FaHourglassHalf", iconType: "date" },
  { index: 41, icon: "FaStopwatch", iconType: "date" },

  // status
  { index: 42, icon: "FaCheckCircle", iconType: "status" },
  { index: 43, icon: "FaTimesCircle", iconType: "status" },
  { index: 44, icon: "FaExclamationTriangle", iconType: "status" },
  { index: 45, icon: "FaInfoCircle", iconType: "status" },
  { index: 46, icon: "FaSpinner", iconType: "status" },
  { index: 47, icon: "MdPending", iconType: "status" },

  // user
  { index: 48, icon: "FaUser", iconType: "user" },
  { index: 49, icon: "FaUsers", iconType: "user" },
  { index: 50, icon: "FaUserTie", iconType: "user" },
  { index: 51, icon: "FaUserCheck", iconType: "user" },
  { index: 52, icon: "FaUserShield", iconType: "user" },
  { index: 53, icon: "FaUserFriends", iconType: "user" },

  // security
  { index: 54, icon: "FaShieldAlt", iconType: "security" },
  { index: 55, icon: "FaLock", iconType: "security" },
  { index: 56, icon: "FaUnlock", iconType: "security" },
  { index: 57, icon: "MdSecurity", iconType: "security" },
  { index: 58, icon: "FaFingerprint", iconType: "security" },
  { index: 59, icon: "FaUserSecret", iconType: "security" },

  // finance
  { index: 60, icon: "FaMoneyBillWave", iconType: "finance" },
  { index: 61, icon: "FaCoins", iconType: "finance" },
  { index: 62, icon: "FaCreditCard", iconType: "finance" },
  { index: 63, icon: "FaFileInvoiceDollar", iconType: "finance" },
  { index: 64, icon: "MdAccountBalanceWallet", iconType: "finance" },
  { index: 65, icon: "FaPiggyBank", iconType: "finance" },

  // communication
  { index: 66, icon: "FaEnvelope", iconType: "communication" },
  { index: 67, icon: "FaPhone", iconType: "communication" },
  { index: 68, icon: "FaComments", iconType: "communication" },
  { index: 69, icon: "MdMessage", iconType: "communication" },
  { index: 70, icon: "FaPaperPlane", iconType: "communication" },
  { index: 71, icon: "FaSms", iconType: "communication" },

  // infrastructure
  { index: 72, icon: "FaCity", iconType: "infrastructure" },
  { index: 73, icon: "FaRoad", iconType: "infrastructure" },
  { index: 74, icon: "FaHospital", iconType: "infrastructure" },
  { index: 75, icon: "FaSchool", iconType: "infrastructure" },
  { index: 76, icon: "FaIndustry", iconType: "infrastructure" },
  { index: 77, icon: "FaWarehouse", iconType: "infrastructure" },

  // analytics
  { index: 78, icon: "FaChartBar", iconType: "analytics" },
  { index: 79, icon: "FaChartPie", iconType: "analytics" },
  { index: 80, icon: "MdShowChart", iconType: "analytics" },
  { index: 81, icon: "FaChartLine", iconType: "analytics" },
  { index: 82, icon: "FaClipboardList", iconType: "analytics" },
  { index: 83, icon: "FaPoll", iconType: "analytics" },
];
