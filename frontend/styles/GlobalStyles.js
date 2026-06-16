import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: '#0A2540',     
  background: '#F4F7FC',   
  white: '#FFFFFF',
  textDark: '#0F172A',     
  textGray: '#64748B',    
  border: '#E2E8F0',       
  success: '#10B981',      
  warning: '#F59E0B',     
  info: '#3B82F6',         
  danger: '#EF4444',     
  
  successBg: '#D1FAE5',    
  warningBg: '#FEF9C3',    
  infoBg: '#DBEAFE',
  unilaGold: '#F5A623',
};

export const globalStyles = StyleSheet.create({
  mainWrapper: { flex: 1, backgroundColor: COLORS.background },
  topOrnament: {
    position: 'absolute', top: -height * 0.15, left: -width * 0.1,
    width: width * 1.2, height: height * 0.35, backgroundColor: COLORS.primary,
    transform: [{ rotate: '-5deg' }], borderBottomLeftRadius: 60, borderBottomRightRadius: 120, zIndex: 0, 
  },
  container: { flex: 1, paddingTop: 80, paddingHorizontal: 24, zIndex: 1 },

  mainLogoWrapper: { 
    backgroundColor: COLORS.white, padding: 12, borderRadius: 60, marginBottom: 16, elevation: 5, 
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 4 }, alignSelf: 'center',
  },
  mainLogo: { width: 70, height: 70 },
  
  headerLogoWrapper: {
    backgroundColor: COLORS.white, padding: 6, borderRadius: 30, marginRight: 12, elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 },
  },
  headerLogo: { width: 34, height: 34 },

    pageTitle: { fontSize: 24, fontWeight: '900', color: COLORS.primary, marginBottom: 10, textAlign: 'center' },
    
    pageSubtitle: { fontSize: 14, color: '#75869f', marginBottom: 20, textAlign: 'center', paddingHorizontal: 20 },
    label: { fontSize: 12, color: COLORS.textDark, fontWeight: '800', marginBottom: 8, marginTop: 15, textTransform: 'uppercase' },

  card: { 
    backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4, 
  },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1,
    borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 15, height: 55,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.textDark },
  btnPrimary: {
    backgroundColor: COLORS.primary, borderRadius: 14, height: 55, flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center', marginTop: 25, shadowColor: COLORS.primary,
    shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  btnPrimaryText: { color: COLORS.white, fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  centerLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
});

export const adminStyles = StyleSheet.create({
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: COLORS.white },
  subtitle: { fontSize: 13, color: '#091e3d' },
  searchContainer: { marginBottom: 10 },
  searchInput: { backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: COLORS.border },
  filterContainer: { marginBottom: 15 },
  filterButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.border, marginRight: 10 },
  filterButtonActive: { backgroundColor: COLORS.primary },
  filterText: { fontSize: 12, color: COLORS.textGray, fontWeight: '600' },
  filterTextActive: { color: COLORS.white },
  btnLogout: { backgroundColor: 'rgba(255, 255, 255, 0.15)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  listContainer: { paddingVertical: 10, paddingBottom: 40 },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  reporterInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  reporterName: { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
  ticketId: { fontSize: 12, color: COLORS.textGray, fontWeight: '600', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginLeft: 10 },
  badgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  ruanganContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.infoBg, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
  ruanganText: { fontSize: 12, fontWeight: '700', color: COLORS.info },
  laporanDeskripsi: { fontSize: 15, color: '#334155', lineHeight: 22, fontWeight: '500', marginBottom: 12 },
  laporanImage: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: COLORS.border },
  noImageContainer: { width: '100%', height: 100, borderRadius: 12, marginBottom: 12, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center', borderStyle: 'dashed' },
  noImageText: { fontSize: 13, color: '#94A3B8', marginTop: 8, fontWeight: '500' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FDF4FF', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
  locationText: { fontSize: 11, fontWeight: '700', color: '#A21CAF' },
  catatanBox: { flexDirection: 'row', backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginTop: 5 },
  catatanTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
  catatanText: { fontSize: 13, color: COLORS.textGray, lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 16 },
  actionContainer: { flexDirection: 'row', justifyContent: 'flex-end' },
  btnAction: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, elevation: 2 },
  btnProses: { backgroundColor: COLORS.warning },
  btnSelesai: { backgroundColor: COLORS.success },
  btnActionText: { color: COLORS.white, fontWeight: '800', fontSize: 14, marginLeft: 8 },
  finishedContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.successBg, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#A7F3D0' },
  finishedText: { color: COLORS.success, fontWeight: '800', fontSize: 13, marginLeft: 6 },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 16, fontSize: 15, color: '#94A3B8', fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', backgroundColor: COLORS.white, borderRadius: 20, padding: 24, elevation: 5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
  modalSubtitle: { fontSize: 13, color: COLORS.textGray, marginBottom: 16, lineHeight: 20 },
  modalInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, fontSize: 14, color: COLORS.textDark, height: 100, marginBottom: 20 },
  btnSimpan: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  btnSimpanText: { color: COLORS.white, fontSize: 15, fontWeight: '700' }
});

export const authStyles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  headerContainer: { alignItems: 'center', marginBottom: 20 },
  eyeIcon: { padding: 8 },
  secretInput: { backgroundColor: COLORS.warningBg, borderColor: COLORS.unilaGold },
  btnGold: { backgroundColor: COLORS.unilaGold, shadowColor: COLORS.unilaGold },
  btnGoldText: { color: COLORS.primary, fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 16, padding: 6, marginBottom: 24 },
  tabButton: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: COLORS.white, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '700', color: COLORS.textGray },
  tabTextActive: { color: COLORS.primary, fontWeight: '800' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: COLORS.textGray, fontSize: 14, fontWeight: '500' },
  loginLink: { color: COLORS.primary, fontSize: 14, fontWeight: '800' }
});

export const formStyles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatarMini: { width: 44, height: 44, borderRadius: 22, marginRight: 12, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.8)' },
  greetingText: { fontSize: 13, color: '#93C5FD', fontWeight: '600' },
  userNameText: { fontSize: 16, color: COLORS.white, fontWeight: '800' },
  pageTitleContainer: { marginBottom: 32 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.white, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#D1D5DB' },
  inputContainerMultiline: { height: 100, alignItems: 'flex-start', paddingVertical: 12 },
  inputIconTop: { marginRight: 10, marginTop: 4 },
  inputMultiline: { flex: 1, fontSize: 15, color: COLORS.textDark, textAlignVertical: 'top', height: '100%' },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: COLORS.border, borderRadius: 16, paddingHorizontal: 16, height: 54, marginBottom: 8 },
  actionButtonActiveFoto: { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' },
  actionButtonActiveLocation: { backgroundColor: '#FDF4FF', borderColor: '#F5D0FE' },
  actionButtonText: { fontSize: 14, color: COLORS.textGray, fontWeight: '600', flex: 1 },
  actionButtonTextActiveFoto: { color: COLORS.success },
  actionButtonTextActiveLocation: { color: '#A21CAF' },
  previewImage: { width: '100%', height: 200, borderRadius: 16, marginTop: 4, marginBottom: 12, borderWidth: 1.5, borderColor: COLORS.border },
  btnKirim: { backgroundColor: COLORS.primary, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 32, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  btnKirimContent: { flexDirection: 'row', alignItems: 'center' },
  btnKirimText: { color: COLORS.white, fontSize: 15, fontWeight: '900', letterSpacing: 0.5 }
});

export const profileStyles = StyleSheet.create({
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginTop: 10, textAlign: 'center' },
  role: { fontSize: 14, color: COLORS.textGray, marginTop: 4, fontWeight: '500' },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  infoText: { marginLeft: 16, flex: 1 },
  infoLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '600', marginBottom: 4 },
  infoValue: { fontSize: 15, color: '#334155', fontWeight: '700' },
  btnLogoutProfile: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    backgroundColor: '#FEF2F2', paddingVertical: 16, borderRadius: 16, 
    borderWidth: 1, borderColor: '#FECACA' 
  },
  btnLogoutProfileText: { color: COLORS.danger, fontSize: 16, fontWeight: '700', marginLeft: 10 },
});

export const historyStyles = StyleSheet.create({
  listContainer: { paddingVertical: 10, paddingBottom: 120 },
  historyCard: { 
    backgroundColor: COLORS.white, padding: 20, borderRadius: 20, 
    marginBottom: 16, marginHorizontal: 24, 
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, 
    shadowOffset: { width: 0, height: 4 }, elevation: 4 
  },
  historyCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  idContainer: { flexDirection: 'row', alignItems: 'center' },
  historyId: { fontSize: 14, fontWeight: '800', color: COLORS.textGray },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginLeft: 10 },
  statusBadgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  historyDesc: { fontSize: 15, color: '#334155', lineHeight: 22, fontWeight: '500', marginTop: 10 },
  historyImage: { 
    width: '100%', height: 160, borderRadius: 12, 
    marginTop: 14, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: COLORS.border 
  },
  emptyHistory: { alignItems: 'center', marginTop: 100 },
  emptyHistoryText: { marginTop: 16, color: COLORS.textGray, fontWeight: '500', fontSize: 15 }
});