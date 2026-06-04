(function (React) {
  'use strict';

  function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

  var React__default = /*#__PURE__*/_interopDefault(React);

  // AdminJS bundle ce composant et le rend quand l'utilisateur ouvre l'entrée
  // "Gestionnaire d'images" dans la sidebar. On redirige immédiatement vers la
  // vraie page Express /uploads (qui vit hors d'AdminJS).
  const RedirectToUploads = () => {
    React.useEffect(() => {
      window.location.replace('/uploads');
    }, []);
    return /*#__PURE__*/React__default.default.createElement("div", {
      style: {
        padding: 24,
        fontFamily: 'system-ui, sans-serif',
        color: '#475569'
      }
    }, "Redirection vers le gestionnaire d\u2019images\u2026", ' ', /*#__PURE__*/React__default.default.createElement("a", {
      href: "/uploads",
      style: {
        color: '#2563eb'
      }
    }, "Cliquez ici si la page ne s\u2019ouvre pas"), ".");
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.RedirectToUploads = RedirectToUploads;

})(React);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9zcmMvYWRtaW4vY29tcG9uZW50cy9SZWRpcmVjdFRvVXBsb2Fkcy5qc3giLCJlbnRyeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG4vLyBBZG1pbkpTIGJ1bmRsZSBjZSBjb21wb3NhbnQgZXQgbGUgcmVuZCBxdWFuZCBsJ3V0aWxpc2F0ZXVyIG91dnJlIGwnZW50csOpZVxuLy8gXCJHZXN0aW9ubmFpcmUgZCdpbWFnZXNcIiBkYW5zIGxhIHNpZGViYXIuIE9uIHJlZGlyaWdlIGltbcOpZGlhdGVtZW50IHZlcnMgbGFcbi8vIHZyYWllIHBhZ2UgRXhwcmVzcyAvdXBsb2FkcyAocXVpIHZpdCBob3JzIGQnQWRtaW5KUykuXG5jb25zdCBSZWRpcmVjdFRvVXBsb2FkcyA9ICgpID0+IHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICB3aW5kb3cubG9jYXRpb24ucmVwbGFjZSgnL3VwbG9hZHMnKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAyNCwgZm9udEZhbWlseTogJ3N5c3RlbS11aSwgc2Fucy1zZXJpZicsIGNvbG9yOiAnIzQ3NTU2OScgfX0+XG4gICAgICBSZWRpcmVjdGlvbiB2ZXJzIGxlIGdlc3Rpb25uYWlyZSBkJnJzcXVvO2ltYWdlc+KApnsnICd9XG4gICAgICA8YSBocmVmPVwiL3VwbG9hZHNcIiBzdHlsZT17eyBjb2xvcjogJyMyNTYzZWInIH19PlxuICAgICAgICBDbGlxdWV6IGljaSBzaSBsYSBwYWdlIG5lIHMmcnNxdW87b3V2cmUgcGFzXG4gICAgICA8L2E+XG4gICAgICAuXG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWRpcmVjdFRvVXBsb2FkcztcbiIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IFJlZGlyZWN0VG9VcGxvYWRzIGZyb20gJy4uL3NyYy9hZG1pbi9jb21wb25lbnRzL1JlZGlyZWN0VG9VcGxvYWRzJ1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5SZWRpcmVjdFRvVXBsb2FkcyA9IFJlZGlyZWN0VG9VcGxvYWRzIl0sIm5hbWVzIjpbIlJlZGlyZWN0VG9VcGxvYWRzIiwidXNlRWZmZWN0Iiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJwYWRkaW5nIiwiZm9udEZhbWlseSIsImNvbG9yIiwiaHJlZiIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUVBO0VBQ0E7RUFDQTtFQUNBLE1BQU1BLGlCQUFpQixHQUFHQSxNQUFNO0VBQzlCQyxFQUFBQSxlQUFTLENBQUMsTUFBTTtFQUNkQyxJQUFBQSxNQUFNLENBQUNDLFFBQVEsQ0FBQ0MsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUNyQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBRU4sb0JBQ0VDLHNCQUFBLENBQUFDLGFBQUEsQ0FBQSxLQUFBLEVBQUE7RUFBS0MsSUFBQUEsS0FBSyxFQUFFO0VBQUVDLE1BQUFBLE9BQU8sRUFBRSxFQUFFO0VBQUVDLE1BQUFBLFVBQVUsRUFBRSx1QkFBdUI7RUFBRUMsTUFBQUEsS0FBSyxFQUFFO0VBQVU7RUFBRSxHQUFBLEVBQUMsc0RBQ2xDLEVBQUMsR0FBRyxlQUNwREwsc0JBQUEsQ0FBQUMsYUFBQSxDQUFBLEdBQUEsRUFBQTtFQUFHSyxJQUFBQSxJQUFJLEVBQUMsVUFBVTtFQUFDSixJQUFBQSxLQUFLLEVBQUU7RUFBRUcsTUFBQUEsS0FBSyxFQUFFO0VBQVU7S0FBRSxFQUFDLDRDQUU3QyxDQUFDLEVBQUEsR0FFRCxDQUFDO0VBRVYsQ0FBQzs7RUNuQkRFLE9BQU8sQ0FBQ0MsY0FBYyxHQUFHLEVBQUU7RUFFM0JELE9BQU8sQ0FBQ0MsY0FBYyxDQUFDYixpQkFBaUIsR0FBR0EsaUJBQWlCOzs7Ozs7In0=
