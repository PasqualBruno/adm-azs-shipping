// Local: src/main/java/com.azship/fretes/service/CompanyService.java

package com.azship.fretes.service;

import com.azship.fretes.dto.CompanyRequest;
import com.azship.fretes.model.Company;
import com.azship.fretes.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List; // 1. IMPORTE ISSO
import java.util.Optional;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    /**
     * Cria uma nova empresa.
     * (Você já tem este método)
     */
    public Company createCompany(CompanyRequest request) {
        // ... (código que você já colou)
        Company newCompany = new Company();
        newCompany.setName(request.getName());
        newCompany.setImage(request.getImage());
        newCompany.setPeso(Optional.ofNullable(request.getPeso()).orElse(false));
        newCompany.setVolume(Optional.ofNullable(request.getVolume()).orElse(false));
        newCompany.setTipoCarga(Optional.ofNullable(request.getTipoCarga()).orElse(false));
        newCompany.setOrigem(Optional.ofNullable(request.getOrigem()).orElse(false));
        newCompany.setDestino(Optional.ofNullable(request.getDestino()).orElse(false));
        newCompany.setDistancia(Optional.ofNullable(request.getDistancia()).orElse(false));
        return companyRepository.save(newCompany);
    }

    // ================================================
    // 2. ADICIONE OS MÉTODOS ABAIXO
    // ================================================

    /**
     * Lista empresas, com filtro opcional de arquivadas.
     * Substitui a lógica do seu: app.get("/api/companies", ...)
     */
    public List<Company> listCompanies(boolean includeArchived) {
        // No seu Node: if (archived === "false") { filter.archived = { $ne: true }; }
        // Se 'includeArchived' for true, queremos todas.
        if (includeArchived) {
            return companyRepository.findAll();
        }

        // Se for false, usamos o método do repositório que busca onde archived = false
        // (Lembre-se que o CompanyRepository tem o método findAllByArchived)
        return companyRepository.findAllByArchived(false);
    }

    /**
     * Atualiza uma empresa existente.
     * Substitui a lógica do seu: app.put("/api/companies/:id", ...)
     */
    public Optional<Company> updateCompany(String id, CompanyRequest request) {
        // const empresa = await Company.findById(id);
        Optional<Company> optionalCompany = companyRepository.findById(id);

        // if (!empresa) { return res.status(404).json(...) }
        if (optionalCompany.isEmpty()) {
            return Optional.empty(); // O Controller vai tratar isso como 404
        }

        Company company = optionalCompany.get();

        // Atualiza os campos (o 'new: true' do Node é o padrão do save())
        company.setName(request.getName());
        company.setImage(request.getImage());
        company.setPeso(Optional.ofNullable(request.getPeso()).orElse(false));
        company.setVolume(Optional.ofNullable(request.getVolume()).orElse(false));
        company.setTipoCarga(Optional.ofNullable(request.getTipoCarga()).orElse(false));
        company.setOrigem(Optional.ofNullable(request.getOrigem()).orElse(false));
        company.setDestino(Optional.ofNullable(request.getDestino()).orElse(false));
        company.setDistancia(Optional.ofNullable(request.getDistancia()).orElse(false));

        // await Company.findByIdAndUpdate(id, dadosAtualizados, { new: true });
        return Optional.of(companyRepository.save(company));
    }

    /**
     * Deleta uma empresa.
     * Substitui a lógica do seu: app.delete("/api/companies/:id", ...)
     */
    public boolean deleteCompany(String id) {
        // const empresa = await Company.findById(id);
        if (!companyRepository.existsById(id)) {
            // if (!empresa) { return res.status(404).json(...) }
            return false;
        }

        // await Company.findByIdAndDelete(id);
        companyRepository.deleteById(id);
        return true;
    }

    /**
     * Arquiva ou desarquiva uma empresa.
     * Substitui a lógica do seu: app.put("/api/companies/:id/archive", ...)
     */
    public Optional<Company> toggleCompanyArchive(String id) {
        // const empresa = await Company.findById(id);
        Optional<Company> optionalCompany = companyRepository.findById(id);

        // if (!empresa) { return res.status(404).json(...) }
        if (optionalCompany.isEmpty()) {
            return Optional.empty();
        }

        Company company = optionalCompany.get();
        // empresa.archived = !empresa.archived;
        company.setArchived(!company.getArchived()); // Inverte o booleano

        // await empresa.save();
        return Optional.of(companyRepository.save(company));
    }
}