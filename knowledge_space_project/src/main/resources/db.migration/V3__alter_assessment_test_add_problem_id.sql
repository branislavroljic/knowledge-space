alter table  public.assessment_test add constraint fk_ks_assessment_test foreign key
    (knowledge_space_id) references  public.knowledge_space(id)