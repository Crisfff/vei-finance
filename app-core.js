    const STORAGE_KEYS = {
      cards: "veiFinanceCardsV2",
      transactions: "veiFinanceTransactionsV2",
      notes: "veiFinanceNotesV2",
      currency: "veiFinanceCurrencyV2"
    };

    const CARD_COLORS = {
      purple: ["#b75df6", "#6826c8"],
      blue: ["#5b95f7", "#1d4cb7"],
      green: ["#3bd08a", "#0f7955"],
      orange: ["#ffa24c", "#d45a18"],
      red: ["#ff7077", "#b91d45"],
      black: ["#535761", "#18191f"]
    };

    let cards = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.cards) || "[]"
    );

    let transactions = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.transactions) || "[]"
    );

    let notes = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.notes) || "[]"
    );

    let currency =
      localStorage.getItem(STORAGE_KEYS.currency) || "EUR";

    let currentEntryType = "income";
    let showAllHomeTransactions = false;

    const balanceValue = document.getElementById("balanceValue");
    const monthIncome = document.getElementById("monthIncome");
    const monthExpense = document.getElementById("monthExpense");

    const summaryIncome = document.getElementById("summaryIncome");
    const summaryExpense = document.getElementById("summaryExpense");
    const monthResult = document.getElementById("monthResult");
    const resultCaption = document.getElementById("resultCaption");

    const incomeProgress = document.getElementById("incomeProgress");
    const expenseProgress = document.getElementById("expenseProgress");
    const resultProgress = document.getElementById("resultProgress");

    const homeCardsList = document.getElementById("homeCardsList");
    const cardsGrid = document.getElementById("cardsGrid");

    const transactionsList =
      document.getElementById("transactionsList");

    const allTransactionsList =
      document.getElementById("allTransactionsList");

    const notesList = document.getElementById("notesList");

    const statsBalance = document.getElementById("statsBalance");
    const statsCards = document.getElementById("statsCards");
    const statsIncome = document.getElementById("statsIncome");
    const statsExpense = document.getElementById("statsExpense");

    const entryModalOverlay =
      document.getElementById("entryModalOverlay");

    const entryModalTitle =
      document.getElementById("entryModalTitle");

    const entryForm = document.getElementById("entryForm");
    const moneyFields = document.getElementById("moneyFields");
    const noteFields = document.getElementById("noteFields");

    const amountInput = document.getElementById("amountInput");
    const cardInput = document.getElementById("cardInput");
    const categoryInput = document.getElementById("categoryInput");

    const descriptionInput =
      document.getElementById("descriptionInput");

    const dateInput = document.getElementById("dateInput");

    const noteTitleInput =
      document.getElementById("noteTitleInput");

    const noteTextInput =
      document.getElementById("noteTextInput");

    const cardModalOverlay =
      document.getElementById("cardModalOverlay");

    const cardModalTitle =
      document.getElementById("cardModalTitle");

    const cardForm = document.getElementById("cardForm");
    const editingCardId = document.getElementById("editingCardId");

    const cardNameInput =
      document.getElementById("cardNameInput");

    const cardInitialInput =
      document.getElementById("cardInitialInput");

    const cardLast4Input =
      document.getElementById("cardLast4Input");

    const cardColorInput =
      document.getElementById("cardColorInput");

    const settingsModalOverlay =
      document.getElementById("settingsModalOverlay");

    const currencyInput =
      document.getElementById("currencyInput");

    const showAllButton =
      document.getElementById("showAllButton");

    dateInput.value = formatDateForInput(new Date());

    function refreshIcons(root = document) {
      if (!window.lucide) {
        return;
      }

      window.lucide.createIcons({
        attrs: {
          "aria-hidden": "true"
        },
        root
      });
    }

    function createId() {
      if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
      }

      return `${Date.now()}-${Math.random()}`;
    }

    function formatMoney(value) {
      const numericValue = Number(value) || 0;

      if (currency === "CUP" || currency === "USDT") {
        return `${new Intl.NumberFormat("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(numericValue)} ${currency}`;
      }

      return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency
      }).format(numericValue);
    }

    function formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    function formatVisibleDate(dateString) {
      const date = new Date(`${dateString}T12:00:00`);

      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(date);
    }

    function escapeHTML(text = "") {
      const element = document.createElement("div");
      element.textContent = text;
      return element.innerHTML;
    }

    function saveData() {
      localStorage.setItem(
        STORAGE_KEYS.cards,
        JSON.stringify(cards)
      );

      localStorage.setItem(
        STORAGE_KEYS.transactions,
        JSON.stringify(transactions)
      );

      localStorage.setItem(
        STORAGE_KEYS.notes,
        JSON.stringify(notes)
      );

      localStorage.setItem(
        STORAGE_KEYS.currency,
        currency
      );
    }

    function getCardTotals(cardId) {
      const card = cards.find((item) => item.id === cardId);

      if (!card) {
        return {
          income: 0,
          expense: 0,
          balance: 0
        };
      }

      let income = 0;
      let expense = 0;

      transactions
        .filter((transaction) => transaction.cardId === cardId)
        .forEach((transaction) => {
          const amount = Number(transaction.amount) || 0;

          if (transaction.type === "income") {
            income += amount;
          }

          if (transaction.type === "expense") {
            expense += amount;
          }
        });

      return {
        income,
        expense,
        balance:
          Number(card.initialBalance || 0) +
          income -
          expense
      };
    }

    function calculateTotals() {
      let totalIncome = 0;
      let totalExpense = 0;

      let monthIncomeTotal = 0;
      let monthExpenseTotal = 0;

      const now = new Date();

      transactions.forEach((transaction) => {
        const amount = Number(transaction.amount) || 0;

        const transactionDate =
          new Date(`${transaction.date}T12:00:00`);

        const isCurrentMonth =
          transactionDate.getMonth() === now.getMonth() &&
          transactionDate.getFullYear() === now.getFullYear();

        if (transaction.type === "income") {
          totalIncome += amount;

          if (isCurrentMonth) {
            monthIncomeTotal += amount;
          }
        }

        if (transaction.type === "expense") {
          totalExpense += amount;

          if (isCurrentMonth) {
            monthExpenseTotal += amount;
          }
        }
      });

      const cardsBalance = cards.reduce((total, card) => {
        return total + getCardTotals(card.id).balance;
      }, 0);

      return {
        totalIncome,
        totalExpense,
        balance: cardsBalance,
        monthIncome: monthIncomeTotal,
        monthExpense: monthExpenseTotal,
        monthBalance:
          monthIncomeTotal - monthExpenseTotal
      };
    }

    function emptyState(icon, message) {
      return `
        <div class="empty-state">
          <div class="empty-icon">
            <i data-lucide="${icon}"></i>
          </div>
          ${message}
        </div>
      `;
    }

