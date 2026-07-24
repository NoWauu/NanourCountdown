/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ARRIVES_AT?: string;
  readonly VITE_MOVES_IN_AT?: string;
  readonly VITE_WAIT_STARTED_AT?: string;
  readonly VITE_FROM_CITY?: string;
  readonly VITE_TO_CITY?: string;
  readonly VITE_HOME_LABEL?: string;
  readonly VITE_EYEBROW?: string;
  readonly VITE_SETTLING_EYEBROW?: string;
  readonly VITE_MESSAGE?: string;
  readonly VITE_SETTLING_MESSAGE?: string;
  readonly VITE_ARRIVED_MESSAGE?: string;
  readonly VITE_ARRIVAL_STEP?: string;
  readonly VITE_MOVE_IN_STEP?: string;
  readonly VITE_LOCALE?: string;
  readonly VITE_TIME_ZONE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
