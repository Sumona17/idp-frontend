import React, { createContext, useContext, useRef } from "react";

const ScrollSyncContext = createContext(null);

export function ScrollSyncProvider({ children }) {
  const groupsRef = useRef({});
  const isSyncing = useRef(false);

  const register = (group, ref) => {
    if (!groupsRef.current[group]) {
      groupsRef.current[group] = [];
    }
    groupsRef.current[group].push(ref);
  };

  const unregister = (group, ref) => {
    groupsRef.current[group] = groupsRef.current[group]?.filter(
      (r) => r !== ref
    );
  };

  const syncScroll = (group, sourceRef, scrollTop) => {
    if (isSyncing.current) return;
    isSyncing.current = true;

    groupsRef.current[group]?.forEach((ref) => {
      if (ref !== sourceRef && ref.current) {
        ref.current.scrollTop = scrollTop;
      }
    });

    isSyncing.current = false;
  };

  return (
    <ScrollSyncContext.Provider value={{ register, unregister, syncScroll }}>
      {children}
    </ScrollSyncContext.Provider>
  );
}

export function useScrollSync(group) {
  const { register, unregister, syncScroll } = useContext(ScrollSyncContext);
  const ref = useRef(null);

  React.useEffect(() => {
    register(group, ref);
    return () => unregister(group, ref);
  }, [group, register, unregister]);

  const onScroll = (e) => {
    syncScroll(group, ref, e.target.scrollTop);
  };

  return { ref, onScroll };
}
