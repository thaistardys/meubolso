/**
 * PROJETO: Controle de Finanças
 * ARQUIVO: script.js (Parte 1 de 5)
 */

const AppState = {
    currentDate: new Date(), 
    transactions: JSON.parse(localStorage.getItem('fin_transactions')) || [],
    categories: JSON.parse(localStorage.getItem('fin_categories')) || [
        'Cartão de Crédito', 'Empréstimo', 'Alimentação', 'Transporte', 'Streaming', 'Lazer', 'Reserva'
    ],
    categoryColors: {
        'Cartão de Crédito': '#A2C4D9', 
        'Empréstimo': '#E2C799',        
        'Alimentação': '#D2E3C8',       
        'Transporte': '#E8A87C',        
        'Streaming': '#C19A6B',         
        'Lazer': '#BCBABE',
        'Reserva': '#5D9CEC'
    },
    dynamicColors: ['#86A789', '#9A7B56', '#D1B3C4', '#B3C5D7', '#EEDDCC', '#C2EABD']
};

const DOM = {
    monthDisplay: document.getElementById('current-month-display'),
    btnNovo: document.getElementById('btn-novo'),
    dropdownMenu: document.getElementById('dropdown-menu'),
    modal: document.getElementById('transaction-modal'),
    form: document.getElementById('transaction-form'),
    recurrenceSelect: document.getElementById('trans-recurrence'),
    parcelaFields: document.getElementById('parcela-fields'),
    recurrenceFields: document.getElementById('recurrence-fields'),
    optionParcelado: document.getElementById('option-parcelado'),
    toggleValueInput: document.getElementById('trans-toggle-value'),
    toggleText: document.getElementById('toggle-text'),
    categorySelect: document.getElementById('trans-category'),
    listReceitas: document.getElementById('list-receitas'),
    listDespesas: document.getElementById('list-despesas'),
    totalReceitas: document.getElementById('total-receitas'),
    totalDespesas: document.getElementById('total-despesas'),
    totalReserva: document.getElementById('total-reserva'),
    totalEfetivados: document.getElementById('total-efetivados'),
    totalSaldo: document.getElementById('total-saldo'),
    chartEl: document.getElementById('category-chart'),
    legendEl: document.getElementById('chart-legend'),
    btnDelete: document.getElementById('btn-delete'),
    
    categoryModal: document.getElementById('category-modal'),
    categoryForm: document.getElementById('category-form'),
    newCategoryInput: document.getElementById('new-category-input'),
    
    customAlert: document.getElementById('custom-alert'),
    customAlertText: document.getElementById('custom-alert-text'),
    customConfirm: document.getElementById('custom-confirm'),
    customConfirmText: document.getElementById('custom-confirm-text'),
    customConfirmTitle: document.getElementById('custom-confirm-title'),
    btnConfirmYes: document.getElementById('btn-confirm-yes'),
    btnConfirmNo: document.getElementById('btn-confirm-no'),
    
    confirmStandardActions: document.getElementById('confirm-standard-actions'),
    confirmRecurrentActions: document.getElementById('confirm-recurrent-actions'),
    btnConfirmOnlyThis: document.getElementById('btn-confirm-only-this'),
    btnConfirmAll: document.getElementById('btn-confirm-all'),

    confirmEditActions: document.getElementById('confirm-edit-actions'),
    btnEditOnly: document.getElementById('btn-edit-only'),
    btnEditFuture: document.getElementById('btn-edit-future'),
    btnEditAll: document.getElementById('btn-edit-all'),
    btnEditCancel: document.getElementById('btn-edit-cancel')
};

const Utils = {
    formatCurrency: (value) => `R$ ${value.toFixed(2).replace('.', ',')}`,
    parseLocalDate: (dateString) => new Date(`${dateString}T00:00:00`),
    formatDateBR: (dateString) => dateString.split('-').reverse().join('/')
};





/**
 * PROJETO: Controle de Finanças
 * ARQUIVO: script.js (Parte 2 de 5)
 */
const Dialogs = {
    showAlert: (message) => {
        if (!DOM.customAlert || !DOM.customAlertText) { alert(message); return; }
        DOM.customAlertText.textContent = message;
        DOM.customAlert.classList.remove('hidden');
    },
    
    closeAlert: () => { if (DOM.customAlert) DOM.customAlert.classList.add('hidden'); },

    showConfirm: (title, message, onYes, onNo) => {
        if (!DOM.customConfirm || !DOM.customConfirmText || !DOM.customConfirmTitle) {
            if (confirm(`${title}\n\n${message}`)) { onYes(); } else { if(onNo) onNo(); }
            return;
        }
        DOM.customConfirmTitle.textContent = title;
        DOM.customConfirmText.innerHTML = message.replace(/\n/g, '<br>');
        DOM.confirmStandardActions.classList.remove('hidden');
        DOM.confirmRecurrentActions.classList.add('hidden');
        DOM.confirmEditActions.classList.add('hidden');
        DOM.customConfirm.classList.remove('hidden');

        DOM.btnConfirmYes.onclick = () => onYes();
        DOM.btnConfirmNo.onclick = () => { DOM.customConfirm.classList.add('hidden'); if (onNo) onNo(); };
    },

    showRecurrentOptions: (title, message, onOnlyThis, onAll) => {
        DOM.customConfirmTitle.textContent = title;
        DOM.customConfirmText.innerHTML = message.replace(/\n/g, '<br>');
        DOM.confirmStandardActions.classList.add('hidden');
        DOM.confirmRecurrentActions.classList.remove('hidden');
        DOM.confirmEditActions.classList.add('hidden');

        DOM.btnConfirmOnlyThis.onclick = () => { DOM.customConfirm.classList.add('hidden'); onOnlyThis(); };
        DOM.btnConfirmAll.onclick = () => { DOM.customConfirm.classList.add('hidden'); onAll(); };
    },

    showEditOptions: (title, message, onOnly, onFuture, onAll) => {
        DOM.customConfirmTitle.textContent = title;
        DOM.customConfirmText.innerHTML = message.replace(/\n/g, '<br>');
        DOM.confirmStandardActions.classList.add('hidden');
        DOM.confirmRecurrentActions.classList.add('hidden');
        DOM.confirmEditActions.classList.remove('hidden');
        DOM.customConfirm.classList.remove('hidden');

        DOM.btnEditOnly.onclick = () => { DOM.customConfirm.classList.add('hidden'); onOnly(); };
        DOM.btnEditFuture.onclick = () => { DOM.customConfirm.classList.add('hidden'); onFuture(); };
        DOM.btnEditAll.onclick = () => { DOM.customConfirm.classList.add('hidden'); onAll(); };
        DOM.btnEditCancel.onclick = () => DOM.customConfirm.classList.add('hidden');
    }
};

const Storage = {
    saveTransactions: (data) => localStorage.setItem('fin_transactions', JSON.stringify(data)),
    saveCategories: (data) => localStorage.setItem('fin_categories', JSON.stringify(data))
};


/**
 * PROJETO: Controle de Finanças
 * ARQUIVO: script.js (Parte 3 de 5)
 */
const UI = {
    updateMonth: () => {
        const monthsNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        if (DOM.monthDisplay) DOM.monthDisplay.textContent = `${monthsNames[AppState.currentDate.getMonth()]} ${AppState.currentDate.getFullYear()}`;
        UI.renderAll();
    },

    loadCategoriesSelect: () => {
        if (DOM.categorySelect) DOM.categorySelect.innerHTML = AppState.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    },

    getCategoryColor: (categoryName) => {
        if (AppState.categoryColors[categoryName]) return AppState.categoryColors[categoryName];
        let hash = 0;
        for (let i = 0; i < categoryName.length; i++) hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
        return AppState.dynamicColors[Math.abs(hash) % AppState.dynamicColors.length];
    },

    getUrgencyClass: (dueDate, status) => {
        if (status === 'liquidada') return 'status-liquidated';
        const today = new Date(); today.setHours(0,0,0,0);
        const targetDate = Utils.parseLocalDate(dueDate);
        const diffDays = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return 'status-danger';
        if (diffDays <= 5) return 'status-warning';
        return 'status-safe';
    },

    renderAll: () => {
        const currentYear = AppState.currentDate.getFullYear();
        const currentMonth = AppState.currentDate.getMonth();

        const monthlyData = AppState.transactions.filter(t => {
            const tDate = Utils.parseLocalDate(t.date);
            return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
        });

        let totalRec = 0, totalDes = 0, totalSettled = 0;
        const categoryTotals = {};

        if (DOM.listReceitas) DOM.listReceitas.innerHTML = '';
        if (DOM.listDespesas) DOM.listDespesas.innerHTML = '';

        monthlyData.forEach(t => {
            const item = document.createElement('li');
            item.className = 'transaction-item';
            
            const isChecked = t.status === 'liquidada';
            if (isChecked) { 
                item.classList.add('line-through'); 
                // REGRA ATUALIZADA: Contabiliza em Efetivados qualquer tipo de despesa liquidada (incluindo Reserva)
                if (t.type === 'despesa') {
                    totalSettled += t.value; 
                }
            }

            item.innerHTML = `
                <div class="item-left-content">
                    <input type="checkbox" class="item-checkbox" ${isChecked ? 'checked' : ''}>
                    <div>
                        <div class="desc">${t.description}</div>
                        <div class="meta">${t.category} • ${Utils.formatDateBR(t.date)}</div>
                    </div>
                </div>
                <strong>${Utils.formatCurrency(t.value)}</strong>
            `;

            const checkbox = item.querySelector('.item-checkbox');
            checkbox.onclick = (e) => {
                e.stopPropagation(); 
                const transIndex = AppState.transactions.findIndex(itemTrans => itemTrans.id === t.id);
                if (transIndex !== -1) {
                    AppState.transactions[transIndex].status = checkbox.checked ? 'liquidada' : 'pendente';
                    Storage.saveTransactions(AppState.transactions);
                    UI.renderAll(); 
                }
            };

            item.onclick = () => ModalManager.open(t.type, t.id);

            if (t.type === 'receita') {
                totalRec += t.value;
                if (DOM.listReceitas) DOM.listReceitas.appendChild(item);
            } else {
                totalDes += t.value;
                item.classList.add(UI.getUrgencyClass(t.date, t.status));
                if (DOM.listDespesas) DOM.listDespesas.appendChild(item);
                categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.value;
            }
        });

        // Cálculo acumulativo histórico da Reserva (Permanece isolado e olhando para trás)
        let totalHistoricalReserve = 0;
        const viewLimitDate = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
        AppState.transactions.forEach(t => {
            const tDate = Utils.parseLocalDate(t.date);
            if (t.category === 'Reserva' && t.status === 'liquidada' && tDate <= viewLimitDate) {
                totalHistoricalReserve += t.value;
            }
        });

        if (DOM.totalReceitas) DOM.totalReceitas.textContent = Utils.formatCurrency(totalRec);
        if (DOM.totalDespesas) DOM.totalDespesas.textContent = Utils.formatCurrency(totalDes);
        if (DOM.totalReserva) DOM.totalReserva.textContent = Utils.formatCurrency(totalHistoricalReserve);
        if (DOM.totalEfetivados) DOM.totalEfetivados.textContent = Utils.formatCurrency(totalSettled);
        
        const saldo = totalRec - totalDes;
        if (DOM.totalSaldo) {
            DOM.totalSaldo.textContent = Utils.formatCurrency(saldo);
            DOM.totalSaldo.style.color = saldo >= 0 ? 'var(--green-sage-dark)' : 'var(--status-danger)';
        }
        UI.renderChart(categoryTotals, totalDes);
    },

    renderChart: (categoryTotals, totalDes) => {
        if (!DOM.legendEl || !DOM.chartEl) return;
        DOM.legendEl.innerHTML = '';
        const categoriesList = Object.keys(categoryTotals);
        if (categoriesList.length === 0 || totalDes === 0) { DOM.chartEl.style.background = `conic-gradient(var(--border-color) 0% 100%)`; DOM.legendEl.innerHTML = `<div class="legend-item">Nenhuma despesa cadastrada neste mês.</div>`; return; }

        let currentPercent = 0; const gradientParts = [];
        categoriesList.forEach((cat) => {
            const val = categoryTotals[cat]; const percent = (val / totalDes) * 100; const color = UI.getCategoryColor(cat);
            gradientParts.push(`${color} ${currentPercent}% ${currentPercent + percent}%`); currentPercent += percent;
            DOM.legendEl.innerHTML += `<div class="legend-item"><span class="legend-color" style="background-color: ${color}"></span><span>${cat}: <strong>${percent.toFixed(1)}%</strong> (${Utils.formatCurrency(val)})</span></div>`;
        });
        DOM.chartEl.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    }
};







/**
 * PROJETO: Controle de Finanças
 * ARQUIVO: script.js (Parte 4 de 5)
 */
const ModalManager = {
    open: (type, id = null) => {
        if (DOM.dropdownMenu) DOM.dropdownMenu.classList.add('hidden');
        UI.loadCategoriesSelect();
        if (DOM.modal) DOM.modal.classList.remove('hidden');
        
        document.getElementById('trans-id').value = id || '';
        document.getElementById('trans-type').value = type;
        if (DOM.btnDelete) DOM.btnDelete.classList.toggle('hidden', !id);

        if (DOM.recurrenceFields) DOM.recurrenceFields.classList.remove('hidden');
        if (DOM.optionParcelado) DOM.optionParcelado.classList.toggle('hidden', type === 'receita');

        if (type === 'despesa') document.getElementById('modal-title').textContent = id ? "Editar Despesa" : "Nova Despesa";
        else { document.getElementById('modal-title').textContent = id ? "Editar Receita" : "Nova Receita"; if (DOM.parcelaFields) DOM.parcelaFields.classList.add('hidden'); }

        if (id) {
            const trans = AppState.transactions.find(t => t.id === id);
            if (trans) {
                document.getElementById('trans-desc').value = trans.description.replace(/\s\(\d+(\/\d+)?\)$/, '').replace(/\s\(Fixa\)$/, '');
                document.getElementById('trans-value').value = trans.value;
                document.getElementById('trans-date').value = trans.date;
                document.getElementById('trans-status').checked = trans.status === 'liquidada';
                if (DOM.categorySelect) DOM.categorySelect.value = trans.category;
                
                if (DOM.recurrenceSelect) DOM.recurrenceSelect.value = trans.recurrence || 'nao-recorrente';
                if (trans.recurrence === 'parcelado' && type === 'despesa') {
                    if (DOM.parcelaFields) DOM.parcelaFields.classList.remove('hidden');
                    document.getElementById('trans-plots').value = trans.plots || 2;
                    if (DOM.toggleValueInput) DOM.toggleValueInput.checked = trans.toggleValue || false;
                    if (DOM.toggleText) DOM.toggleText.textContent = trans.toggleValue ? "Valor Total (Calcular parcelas)" : "Valor da Parcela";
                }
            }
        } else {
            DOM.form.reset();
            if (DOM.recurrenceSelect) DOM.recurrenceSelect.value = 'nao-recorrente';
            if (DOM.toggleValueInput) DOM.toggleValueInput.checked = false;
            if (DOM.toggleText) DOM.toggleText.textContent = "Valor da Parcela";
        }
    },

    close: () => { if (DOM.modal) DOM.modal.classList.add('hidden'); },

    submit: (e) => {
        e.preventDefault();
        const id = document.getElementById('trans-id').value;
        const type = document.getElementById('trans-type').value;
        const description = document.getElementById('trans-desc').value;
        let value = parseFloat(document.getElementById('trans-value').value);
        const date = document.getElementById('trans-date').value;
        const status = document.getElementById('trans-status').checked ? 'liquidada' : 'pendente';
        const category = DOM.categorySelect ? DOM.categorySelect.value : '';

        let recurrence = DOM.recurrenceSelect ? DOM.recurrenceSelect.value : 'nao-recorrente';
        let plots = null; let toggleValue = false;

        if (type === 'despesa' && recurrence === 'parcelado') {
            plots = parseInt(document.getElementById('trans-plots').value);
            toggleValue = DOM.toggleValueInput ? DOM.toggleValueInput.checked : false;
            if (toggleValue) value = parseFloat((value / plots).toFixed(2));
        }

        if (id) {
            const index = AppState.transactions.findIndex(t => t.id === id);
            if (index === -1) return;
            const targetItem = AppState.transactions[index];

            // Identifica se os dados estruturais (valores ou textos) foram modificados
            const cleanTargetDesc = targetItem.description.replace(/\s\(\d+(\/\d+)?\)$/, '').replace(/\s\(Fixa\)$/, '');
            const hasStructuralChanges = value !== targetItem.value || description !== cleanTargetDesc || category !== targetItem.category;

            // INTEGRAÇÃO INTELIGENTE: Se mudou só o checkbox (status) ou data, salva isoladamente SEM abrir modal triplo
            if (targetItem.groupId && targetItem.recurrence === 'fixa' && hasStructuralChanges) {
                ModalManager.close();
                Dialogs.showEditOptions(
                    "Propagar Alterações da Conta Fixa",
                    "Como você deseja aplicar as modificações feitas nesta conta recorrente?",
                    () => { 
                        let displayDesc = recurrence === 'fixa' ? `${description} (Fixa)` : description;
                        AppState.transactions[index] = { ...targetItem, description: displayDesc, value, date, status, category };
                        Storage.saveTransactions(AppState.transactions); UI.renderAll();
                    },
                    () => { 
                        const pivotDate = Utils.parseLocalDate(targetItem.date);
                        AppState.transactions = AppState.transactions.map(t => {
                            if (t.groupId === targetItem.groupId && Utils.parseLocalDate(t.date) >= pivotDate) {
                                return { ...t, description: `${description} (Fixa)`, value, category };
                            }
                            return t;
                        });
                        Storage.saveTransactions(AppState.transactions); UI.renderAll();
                    },
                    () => { 
                        AppState.transactions = AppState.transactions.map(t => {
                            if (t.groupId === targetItem.groupId) {
                                return { ...t, description: `${description} (Fixa)`, value, category };
                            }
                            return t;
                        });
                        Storage.saveTransactions(AppState.transactions); UI.renderAll();
                    }
                );
            } else {
                // Salva direto para alterações de status (Efetivar) ou contas normais
                let displayDesc = recurrence === 'parcelado' ? `${description} (${targetItem.plotIndex || 1}/${plots})` : (recurrence === 'fixa' ? `${description} (Fixa)` : description);
                AppState.transactions[index] = { ...targetItem, description: displayDesc, value, date, status, category, recurrence, plots, toggleValue };
                Storage.saveTransactions(AppState.transactions); UI.renderAll(); ModalManager.close();
            }
        } else {
            if (recurrence === 'parcelado' || recurrence === 'fixa') {
                let baseDate = Utils.parseLocalDate(date); const generatedGroupId = `group-${Date.now()}`;
                const loopLimit = recurrence === 'fixa' ? 12 : plots;
                for (let i = 0; i < loopLimit; i++) {
                    let plotDate = new Date(baseDate); plotDate.setMonth(plotDate.getMonth() + i);
                    let finalDesc = recurrence === 'fixa' ? `${description} (Fixa)` : `${description} (${i + 1}/${plots})`;
                    AppState.transactions.push({ id: `${Date.now()}-${i}`, groupId: generatedGroupId, plotIndex: i + 1, type, description: finalDesc, value, date: plotDate.toISOString().split('T')[0], status, category, recurrence, plots, toggleValue });
                }
            } else {
                AppState.transactions.push({ id: Date.now().toString(), type, description, value, date: date, status, category, recurrence, plots, toggleValue });
            }
            Storage.saveTransactions(AppState.transactions); UI.renderAll(); ModalManager.close();
        }
    },







	/**
 * PROJETO: Controle de Finanças
 * ARQUIVO: script.js (Parte 5 de 5)
 */
    delete: () => {
        const id = document.getElementById('trans-id').value;
        const transToDelete = AppState.transactions.find(t => t.id === id);
        if (!transToDelete) return;

        ModalManager.close(); 

        Dialogs.showConfirm(
            "Excluir Registro",
            `Deseja realmente apagar o registro de "${transToDelete.description}" do sistema?`,
            () => {
                if (transToDelete.groupId) {
                    setTimeout(() => {
                        const contextTitle = transToDelete.recurrence === 'fixa' ? "Remover Lançamento Fixo" : "Remover Conta Parcelada";
                        const contextMsg = transToDelete.recurrence === 'fixa'
                            ? "Este registro está configurado como Fixo Mensal.<br><br>• Clique em <b>SIM</b> para remover <b>TODAS</b> as recorrências dele.<br>• Clique em <b>NÃO</b> para remover <b>APENAS</b> a deste mês corrente."
                            : "Esta conta faz parte de um parcelamento integrado.<br><br>• Clique em <b>SIM</b> para remover <b>TODAS</b> as parcelas desta dívida.<br>• Clique em <b>NÃO</b> para remover <b>APENAS</b> esta parcela corrente.";

                        Dialogs.showRecurrentOptions(
                            contextTitle, contextMsg,
                            () => { AppState.transactions = AppState.transactions.filter(t => t.id !== id); Storage.saveTransactions(AppState.transactions); UI.renderAll(); },
                            () => { AppState.transactions = AppState.transactions.filter(t => t.groupId !== transToDelete.groupId); Storage.saveTransactions(AppState.transactions); UI.renderAll(); }
                        );
                    }, 300); 
                } else {
                    AppState.transactions = AppState.transactions.filter(t => t.id !== id);
                    Storage.saveTransactions(AppState.transactions); UI.renderAll(); DOM.customConfirm.classList.add('hidden');
                }
            },
            () => {} 
        );
    }
};

const CategoryManager = {
    openModal: () => { if (DOM.categoryModal) { if (DOM.categoryForm) DOM.categoryForm.reset(); DOM.categoryModal.classList.remove('hidden'); } },
    closeModal: () => { if (DOM.categoryModal) DOM.categoryModal.classList.add('hidden'); },
    submit: (e) => {
        e.preventDefault(); if (!DOM.newCategoryInput) return;
        const newCat = DOM.newCategoryInput.value.trim();
        if (newCat && !AppState.categories.includes(newCat)) { AppState.categories.push(newCat); Storage.saveCategories(AppState.categories); UI.loadCategoriesSelect(); if (DOM.categorySelect) DOM.categorySelect.value = newCat; CategoryManager.closeModal(); }
        else if (AppState.categories.includes(newCat)) Dialogs.showAlert("Esta categoria já encontra-se cadastrada.");
    },
    removeCurrent: () => {
        if (!DOM.categorySelect) return; const selectedCat = DOM.categorySelect.value; if (!selectedCat) return;
        if (selectedCat === 'Reserva') { Dialogs.showAlert("A categoria nativa 'Reserva' é protegida pelo sistema e não pode ser excluída."); return; }
        if (AppState.transactions.some(t => t.category === selectedCat)) { Dialogs.showAlert(`Não é possível excluir a categoria "${selectedCat}" porque existem contas vinculadas a ela. Altere ou remova as transações primeiro.`); return; }

        Dialogs.showConfirm("Excluir Categoria", `Tem certeza que deseja remover permanentemente a categoria "${selectedCat}" do seu sistema?`, () => { AppState.categories = AppState.categories.filter(cat => cat !== selectedCat); Storage.saveCategories(AppState.categories); UI.loadCategoriesSelect(); DOM.customConfirm.classList.add('hidden'); }, () => {});
    }
};

const ActionsManager = {
    init: () => {
        document.getElementById('prev-month').onclick = () => ActionsManager.changeMonth(-1);
        document.getElementById('next-month').onclick = () => ActionsManager.changeMonth(1);
        
        if (DOM.btnNovo) {
            DOM.btnNovo.onclick = (e) => {
                e.stopPropagation();
                if (DOM.dropdownMenu) DOM.dropdownMenu.classList.toggle('hidden');
            };
        }
        document.onclick = () => { if (DOM.dropdownMenu) DOM.dropdownMenu.classList.add('hidden'); };

        const btnNovaReceita = document.getElementById('btn-nova-receita');
        const btnNovaDespesa = document.getElementById('btn-nova-despesa');
        if (btnNovaReceita) btnNovaReceita.onclick = () => ModalManager.open('receita');
        if (btnNovaDespesa) btnNovaDespesa.onclick = () => ModalManager.open('despesa');

        if (DOM.recurrenceSelect) DOM.recurrenceSelect.onchange = (e) => { if (DOM.parcelaFields) DOM.parcelaFields.classList.toggle('hidden', e.target.value !== 'parcelado'); };
        if (DOM.toggleValueInput) DOM.toggleValueInput.onchange = (e) => { if (DOM.toggleText) DOM.toggleText.textContent = e.target.checked ? "Valor Total (Calcular parcelas)" : "Valor da Parcela"; };

        const btnCloseTrans = document.getElementById('btn-close-transaction');
        const btnCloseCat = document.getElementById('btn-close-category');
        const btnCancelCat = document.getElementById('btn-cancel-category');
        const btnCloseAlert = document.getElementById('btn-close-alert');

        if (btnCloseTrans) btnCloseTrans.onclick = ModalManager.close;
        if (btnCloseCat) btnCloseCat.onclick = CategoryManager.closeModal;
        if (btnCancelCat) btnCancelCat.onclick = CategoryManager.closeModal;
        if (btnCloseAlert) btnCloseAlert.onclick = Dialogs.closeAlert;

        const addCatBtn = document.getElementById('btn-add-category');
        const removeCatBtn = document.getElementById('btn-remove-category');
        if (addCatBtn) addCatBtn.onclick = CategoryManager.openModal;
        if (removeCatBtn) removeCatBtn.onclick = CategoryManager.removeCurrent;
        if (DOM.categoryForm) DOM.categoryForm.onsubmit = CategoryManager.submit;

        if (DOM.form) DOM.form.onsubmit = ModalManager.submit;
        if (DOM.btnDelete) DOM.btnDelete.onclick = ModalManager.delete;

        UI.updateMonth();
    },
    changeMonth: (modifier) => { AppState.currentDate.setMonth(AppState.currentDate.getMonth() + modifier); UI.updateMonth(); }
};

window.addEventListener('DOMContentLoaded', ActionsManager.init);



